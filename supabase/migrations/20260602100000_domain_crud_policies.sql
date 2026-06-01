-- CRUD policies for missions, colonies, and incidents

create or replace function public.has_app_role(p_roles public.app_role[])
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
      and p.status = 'active'
      and p.role = any (p_roles)
  );
$$;

create or replace function public.can_write_mission(p_mission_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_app_role(array['system_admin', 'mission_lead']::public.app_role[])
    or public.has_mission_role(
      p_mission_id,
      array['lead']::public.membership_role[]
    );
$$;

create or replace function public.can_write_colony_for_mission(p_mission_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_app_role(
      array['system_admin', 'mission_lead', 'colony_admin']::public.app_role[]
    )
    or public.has_mission_role(
      p_mission_id,
      array['operator', 'lead']::public.membership_role[]
    );
$$;

create or replace function public.can_delete_incident(
  p_mission_id uuid,
  p_reporter_id uuid,
  p_status public.incident_status
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_app_role(array['system_admin', 'mission_lead']::public.app_role[])
    or public.has_mission_role(
      p_mission_id,
      array['lead']::public.membership_role[]
    )
    or (
      p_reporter_id = auth.uid()
      and p_status = 'open'
    )
    or public.has_mission_role(
      p_mission_id,
      array['operator', 'lead']::public.membership_role[]
    );
$$;

revoke all on function public.has_app_role(public.app_role[]) from public;
revoke all on function public.can_write_mission(uuid) from public;
revoke all on function public.can_write_colony_for_mission(uuid) from public;
revoke all on function public.can_delete_incident(uuid, uuid, public.incident_status) from public;

grant execute on function public.has_app_role(public.app_role[]) to authenticated;
grant execute on function public.can_write_mission(uuid) to authenticated;
grant execute on function public.can_write_colony_for_mission(uuid) to authenticated;
grant execute on function public.can_delete_incident(uuid, uuid, public.incident_status) to authenticated;

-- Auto-add creator as mission lead
create or replace function public.add_mission_creator_as_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    insert into public.mission_members (mission_id, user_id, role)
    values (new.id, auth.uid(), 'lead')
    on conflict (mission_id, user_id) do update
      set role = 'lead';
  end if;
  return new;
end;
$$;

drop trigger if exists missions_add_creator_lead on public.missions;

create trigger missions_add_creator_lead
  after insert on public.missions
  for each row
  execute function public.add_mission_creator_as_lead();

-- Missions CRUD
create policy "missions_insert_authenticated"
  on public.missions
  for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "missions_update_writer"
  on public.missions
  for update
  to authenticated
  using (public.can_write_mission(id))
  with check (public.can_write_mission(id));

create policy "missions_delete_writer"
  on public.missions
  for delete
  to authenticated
  using (public.can_write_mission(id));

-- Colonies CRUD
create policy "colonies_insert_writer"
  on public.colonies
  for insert
  to authenticated
  with check (public.can_write_colony_for_mission(mission_id));

create policy "colonies_update_writer"
  on public.colonies
  for update
  to authenticated
  using (public.can_write_colony_for_mission(mission_id))
  with check (public.can_write_colony_for_mission(mission_id));

create policy "colonies_delete_writer"
  on public.colonies
  for delete
  to authenticated
  using (public.can_write_colony_for_mission(mission_id));

-- Incidents: reporter can edit open incidents; delete with broader rules
create policy "incidents_update_reporter_open"
  on public.incidents
  for update
  to authenticated
  using (reporter_id = auth.uid() and status = 'open')
  with check (reporter_id = auth.uid());

create policy "incidents_delete_authorized"
  on public.incidents
  for delete
  to authenticated
  using (
    public.can_delete_incident(mission_id, reporter_id, status)
  );

-- Allow operators to remove own attachment rows when deleting evidence
create policy "incident_attachments_delete_operator"
  on public.incident_attachments
  for delete
  to authenticated
  using (
    uploaded_by = auth.uid()
    or exists (
      select 1
      from public.incidents as i
      where i.id = incident_id
        and public.has_mission_role(
          i.mission_id,
          array['operator', 'lead']::public.membership_role[]
        )
    )
    or public.has_app_role(array['system_admin', 'mission_lead']::public.app_role[])
  );
