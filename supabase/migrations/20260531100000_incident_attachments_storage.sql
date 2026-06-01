-- Phase 3: incident attachments + private storage bucket

create table public.incident_attachments (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents (id) on delete cascade,
  uploaded_by uuid not null references public.profiles (id) on delete restrict,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  file_size_bytes integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint incident_attachments_mime check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp')
  ),
  constraint incident_attachments_size check (
    file_size_bytes > 0 and file_size_bytes <= 5242880
  ),
  constraint incident_attachments_name_length check (char_length(file_name) between 1 and 255)
);

create index incident_attachments_incident_idx on public.incident_attachments (incident_id);

create trigger incident_attachments_set_updated_at
  before update on public.incident_attachments
  for each row execute function public.set_updated_at();

alter table public.incident_attachments enable row level security;

create policy "incident_attachments_select"
  on public.incident_attachments
  for select
  to authenticated
  using (
    exists (
      select 1 from public.incidents as i
      where i.id = incident_id
        and (
          public.is_mission_member(i.mission_id)
          or i.reporter_id = auth.uid()
        )
    )
  );

create policy "incident_attachments_insert"
  on public.incident_attachments
  for insert
  to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.incidents as i
      where i.id = incident_id
        and public.has_mission_role(
          i.mission_id,
          array['operator', 'lead']::public.membership_role[]
        )
    )
  );

-- Storage bucket (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'incident-evidence',
  'incident-evidence',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Path format: {incident_id}/{filename}
create policy "incident_evidence_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'incident-evidence'
    and exists (
      select 1
      from public.incidents as i
      where i.id::text = (storage.foldername(name))[1]
        and (
          public.is_mission_member(i.mission_id)
          or i.reporter_id = auth.uid()
        )
    )
  );

create policy "incident_evidence_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'incident-evidence'
    and exists (
      select 1
      from public.incidents as i
      where i.id::text = (storage.foldername(name))[1]
        and public.has_mission_role(
          i.mission_id,
          array['operator', 'lead']::public.membership_role[]
        )
    )
  );

create policy "incident_evidence_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'incident-evidence'
    and owner = auth.uid()
  );
