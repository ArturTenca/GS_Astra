-- Phase 4: security audit log

create type public.audit_action as enum (
  'auth.login',
  'auth.logout',
  'auth.mfa_enrolled',
  'auth.mfa_verified',
  'auth.mfa_removed',
  'incident.created',
  'incident.status_updated',
  'incident.attachment_uploaded',
  'security.access_denied'
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action public.audit_action not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint audit_events_resource_type_length check (
    resource_type is null or char_length(resource_type) between 1 and 64
  ),
  constraint audit_events_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create index audit_events_actor_idx on public.audit_events (actor_id, created_at desc);
create index audit_events_action_idx on public.audit_events (action, created_at desc);
create index audit_events_resource_idx on public.audit_events (resource_type, resource_id);

create trigger audit_events_set_updated_at
  before update on public.audit_events
  for each row execute function public.set_updated_at();

create or replace function public.can_read_audit_events()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role in ('security_officer', 'system_admin')
  );
$$;

revoke all on function public.can_read_audit_events() from public;
grant execute on function public.can_read_audit_events() to authenticated;

alter table public.audit_events enable row level security;

create policy "audit_events_insert_own"
  on public.audit_events
  for insert
  to authenticated
  with check (actor_id = auth.uid());

create policy "audit_events_select_own"
  on public.audit_events
  for select
  to authenticated
  using (actor_id = auth.uid());

create policy "audit_events_select_security"
  on public.audit_events
  for select
  to authenticated
  using (public.can_read_audit_events());
