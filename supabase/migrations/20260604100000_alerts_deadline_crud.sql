-- Alerts: deadline (active_until) + CRUD for writers

alter table public.alerts
  add column if not exists active_until date;

comment on column public.alerts.active_until is
  'Inclusive end date; alert stays active until this day (UTC). NULL = no deadline.';

create or replace function public.is_alert_active(
  p_acknowledged_at timestamptz,
  p_active_until date
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_acknowledged_at is null
    and (
      p_active_until is null
      or p_active_until >= (timezone('utc', now()))::date
    );
$$;

revoke all on function public.is_alert_active(timestamptz, date) from public;
grant execute on function public.is_alert_active(timestamptz, date) to authenticated;

drop index if exists public.alerts_unacknowledged_idx;

create index alerts_active_pending_idx on public.alerts (mission_id, created_at desc)
  where acknowledged_at is null
    and (active_until is null or active_until >= (timezone('utc', now()))::date);

-- Insert: writers only (operators, colony admins, leads)
drop policy if exists "alerts_insert_service" on public.alerts;

create policy "alerts_insert_writer"
  on public.alerts
  for insert
  to authenticated
  with check (public.can_write_colony_for_mission(mission_id));

-- Full update for mission/colony writers (ack policy remains for members)
create policy "alerts_update_writer"
  on public.alerts
  for update
  to authenticated
  using (public.can_write_colony_for_mission(mission_id))
  with check (public.can_write_colony_for_mission(mission_id));

create policy "alerts_delete_writer"
  on public.alerts
  for delete
  to authenticated
  using (public.can_write_colony_for_mission(mission_id));
