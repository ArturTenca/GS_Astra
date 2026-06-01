-- Phase 5: operational alerts + colony telemetry

create type public.alert_severity as enum ('info', 'warning', 'critical');

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  colony_id uuid references public.colonies (id) on delete set null,
  incident_id uuid references public.incidents (id) on delete set null,
  title text not null,
  message text not null,
  severity public.alert_severity not null default 'info',
  acknowledged_at timestamptz,
  acknowledged_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint alerts_title_length check (char_length(title) between 2 and 160),
  constraint alerts_message_length check (char_length(message) between 2 and 2000)
);

create index alerts_mission_created_idx on public.alerts (mission_id, created_at desc);
create index alerts_unacknowledged_idx on public.alerts (mission_id, created_at desc)
  where acknowledged_at is null;

create trigger alerts_set_updated_at
  before update on public.alerts
  for each row execute function public.set_updated_at();

create table public.colony_telemetry (
  id uuid primary key default gen_random_uuid(),
  colony_id uuid not null references public.colonies (id) on delete cascade,
  metric_key text not null,
  value numeric not null,
  unit text not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint colony_telemetry_metric_key_length check (char_length(metric_key) between 1 and 64),
  constraint colony_telemetry_unit_length check (char_length(unit) between 1 and 16)
);

create index colony_telemetry_colony_metric_idx
  on public.colony_telemetry (colony_id, metric_key, recorded_at desc);

create trigger colony_telemetry_set_updated_at
  before update on public.colony_telemetry
  for each row execute function public.set_updated_at();

alter table public.alerts enable row level security;
alter table public.colony_telemetry enable row level security;

create policy "alerts_select_member"
  on public.alerts
  for select
  to authenticated
  using (public.is_mission_member(mission_id));

create policy "alerts_update_acknowledge"
  on public.alerts
  for update
  to authenticated
  using (public.is_mission_member(mission_id))
  with check (
    public.is_mission_member(mission_id)
    and acknowledged_by = auth.uid()
  );

create policy "alerts_insert_service"
  on public.alerts
  for insert
  to authenticated
  with check (public.is_mission_member(mission_id));

create policy "colony_telemetry_select_member"
  on public.colony_telemetry
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.colonies as c
      where c.id = colony_id
        and public.is_mission_member(c.mission_id)
    )
  );

create policy "colony_telemetry_insert_operator"
  on public.colony_telemetry
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.colonies as c
      where c.id = colony_id
        and public.can_write_colony_for_mission(c.mission_id)
    )
  );

-- Auto-alert on high/critical incidents
create or replace function public.create_alert_for_incident()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.severity in ('high', 'critical') then
    insert into public.alerts (
      mission_id,
      colony_id,
      incident_id,
      title,
      message,
      severity
    ) values (
      new.mission_id,
      new.colony_id,
      new.id,
      'Incident: ' || left(new.title, 120),
      left(new.description, 500),
      case
        when new.severity = 'critical' then 'critical'::public.alert_severity
        else 'warning'::public.alert_severity
      end
    );
  end if;
  return new;
end;
$$;

create trigger incidents_create_alert
  after insert on public.incidents
  for each row
  execute function public.create_alert_for_incident();

-- Realtime for alerts (skip if already added — enable in Dashboard → Database → Replication)
do $$
begin
  alter publication supabase_realtime add table public.alerts;
exception
  when duplicate_object then null;
end;
$$;
