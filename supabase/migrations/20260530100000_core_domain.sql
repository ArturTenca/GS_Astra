-- ASTRA Phase 2: core domain (missions, colonies, incidents)

-- Enums
create type public.mission_status as enum ('planned', 'active', 'completed', 'aborted');
create type public.colony_status as enum ('operational', 'degraded', 'critical', 'offline');
create type public.incident_severity as enum ('low', 'medium', 'high', 'critical');
create type public.incident_status as enum ('open', 'investigating', 'resolved', 'closed');
create type public.membership_role as enum ('viewer', 'operator', 'lead');

-- Missions
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text,
  status public.mission_status not null default 'planned',
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint missions_name_length check (char_length(name) between 2 and 120),
  constraint missions_code_format check (code ~ '^[A-Z0-9-]{2,16}$')
);

-- Mission membership (scoped access)
create table public.mission_members (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.membership_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mission_id, user_id)
);

-- Colonies / habitats
create table public.colonies (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  name text not null,
  code text not null,
  location_label text,
  status public.colony_status not null default 'operational',
  environment_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mission_id, code),
  constraint colonies_name_length check (char_length(name) between 2 and 120)
);

create table public.colony_members (
  id uuid primary key default gen_random_uuid(),
  colony_id uuid not null references public.colonies (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.membership_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (colony_id, user_id)
);

-- Incidents (core academic flow — Phase 2b will wire full UI)
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  colony_id uuid references public.colonies (id) on delete set null,
  reporter_id uuid not null references public.profiles (id) on delete restrict,
  title text not null,
  description text not null,
  severity public.incident_severity not null default 'medium',
  status public.incident_status not null default 'open',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint incidents_title_length check (char_length(title) between 3 and 120),
  constraint incidents_description_length check (char_length(description) between 10 and 4000)
);

create table public.incident_status_history (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents (id) on delete cascade,
  changed_by uuid not null references public.profiles (id) on delete restrict,
  from_status public.incident_status,
  to_status public.incident_status not null,
  note text,
  created_at timestamptz not null default now()
);

-- Indexes
create index missions_status_idx on public.missions (status);
create index mission_members_user_idx on public.mission_members (user_id);
create index colonies_mission_idx on public.colonies (mission_id);
create index colony_members_user_idx on public.colony_members (user_id);
create index incidents_mission_status_idx on public.incidents (mission_id, status, created_at desc);
create index incidents_colony_idx on public.incidents (colony_id);

-- updated_at triggers
create trigger missions_set_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

create trigger mission_members_set_updated_at
  before update on public.mission_members
  for each row execute function public.set_updated_at();

create trigger colonies_set_updated_at
  before update on public.colonies
  for each row execute function public.set_updated_at();

create trigger colony_members_set_updated_at
  before update on public.colony_members
  for each row execute function public.set_updated_at();

create trigger incidents_set_updated_at
  before update on public.incidents
  for each row execute function public.set_updated_at();

-- RLS helper functions
create or replace function public.is_mission_member(p_mission_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.mission_members as mm
    where mm.mission_id = p_mission_id
      and mm.user_id = auth.uid()
  );
$$;

create or replace function public.is_colony_member(p_colony_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.colony_members as cm
    where cm.colony_id = p_colony_id
      and cm.user_id = auth.uid()
  );
$$;

create or replace function public.has_mission_role(p_mission_id uuid, p_roles public.membership_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.mission_members as mm
    where mm.mission_id = p_mission_id
      and mm.user_id = auth.uid()
      and mm.role = any (p_roles)
  );
$$;

revoke all on function public.is_mission_member(uuid) from public;
revoke all on function public.is_colony_member(uuid) from public;
revoke all on function public.has_mission_role(uuid, public.membership_role[]) from public;
grant execute on function public.is_mission_member(uuid) to authenticated;
grant execute on function public.is_colony_member(uuid) to authenticated;
grant execute on function public.has_mission_role(uuid, public.membership_role[]) to authenticated;

-- Enable RLS
alter table public.missions enable row level security;
alter table public.mission_members enable row level security;
alter table public.colonies enable row level security;
alter table public.colony_members enable row level security;
alter table public.incidents enable row level security;
alter table public.incident_status_history enable row level security;

-- missions policies
create policy "missions_select_member"
  on public.missions for select to authenticated
  using (public.is_mission_member(id));

-- mission_members policies
create policy "mission_members_select_own_missions"
  on public.mission_members for select to authenticated
  using (public.is_mission_member(mission_id));

-- colonies policies
create policy "colonies_select_member"
  on public.colonies for select to authenticated
  using (public.is_mission_member(mission_id));

-- colony_members policies
create policy "colony_members_select_own_colonies"
  on public.colony_members for select to authenticated
  using (public.is_colony_member(colony_id) or public.is_mission_member(
    (select c.mission_id from public.colonies as c where c.id = colony_id)
  ));

-- incidents policies
create policy "incidents_select_member"
  on public.incidents for select to authenticated
  using (public.is_mission_member(mission_id));

create policy "incidents_insert_operator"
  on public.incidents for insert to authenticated
  with check (
    public.has_mission_role(mission_id, array['operator', 'lead']::public.membership_role[])
    and reporter_id = auth.uid()
  );

create policy "incidents_update_operator"
  on public.incidents for update to authenticated
  using (
    public.has_mission_role(mission_id, array['operator', 'lead']::public.membership_role[])
  )
  with check (
    public.has_mission_role(mission_id, array['operator', 'lead']::public.membership_role[])
  );

-- incident history policies
create policy "incident_history_select_member"
  on public.incident_status_history for select to authenticated
  using (
    exists (
      select 1 from public.incidents as i
      where i.id = incident_id
        and public.is_mission_member(i.mission_id)
    )
  );

create policy "incident_history_insert_operator"
  on public.incident_status_history for insert to authenticated
  with check (
    changed_by = auth.uid()
    and exists (
      select 1 from public.incidents as i
      where i.id = incident_id
        and public.has_mission_role(i.mission_id, array['operator', 'lead']::public.membership_role[])
    )
  );

-- Auto-log incident status changes
create or replace function public.log_incident_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.incident_status_history (
      incident_id, changed_by, from_status, to_status
    ) values (
      new.id, auth.uid(), old.status, new.status
    );
  end if;
  return new;
end;
$$;

create trigger incidents_log_status_change
  after update of status on public.incidents
  for each row execute function public.log_incident_status_change();
