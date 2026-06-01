-- Allow users to read incidents they reported, even if mission_members row is missing

drop policy if exists "incidents_select_member" on public.incidents;

create policy "incidents_select_member_or_reporter"
  on public.incidents
  for select
  to authenticated
  using (
    public.is_mission_member(mission_id)
    or reporter_id = auth.uid()
  );

drop policy if exists "incident_history_select_member" on public.incident_status_history;

create policy "incident_history_select_member_or_reporter"
  on public.incident_status_history
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.incidents as i
      where i.id = incident_id
        and (
          public.is_mission_member(i.mission_id)
          or i.reporter_id = auth.uid()
        )
    )
  );
