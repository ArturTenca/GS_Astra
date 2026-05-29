-- Seed demo missions/colonies. Replace USER_ID with your auth.users UUID.
-- Run after registering your first user:
--
--   select id from auth.users limit 1;

do $$
declare
  v_user_id uuid;
  v_mission_artemis uuid;
  v_mission_orion uuid;
  v_colony_lda uuid;
begin
  select id into v_user_id from auth.users order by created_at asc limit 1;

  if v_user_id is null then
    raise notice 'No users found — skip seed until after first registration.';
    return;
  end if;

  insert into public.missions (id, name, code, description, status, start_at)
  values (
    gen_random_uuid(),
    'Artemis Surface Support',
    'ART-01',
    'Lunar south pole habitat monitoring and EVA coordination.',
    'active',
    now() - interval '30 days'
  )
  on conflict (code) do nothing
  returning id into v_mission_artemis;

  if v_mission_artemis is null then
    select id into v_mission_artemis from public.missions where code = 'ART-01';
  end if;

  insert into public.missions (id, name, code, description, status, start_at)
  values (
    gen_random_uuid(),
    'Orion Deep Relay',
    'ORI-07',
    'Deep-space relay station telemetry and link integrity.',
    'active',
    now() - interval '90 days'
  )
  on conflict (code) do nothing
  returning id into v_mission_orion;

  if v_mission_orion is null then
    select id into v_mission_orion from public.missions where code = 'ORI-07';
  end if;

  insert into public.mission_members (mission_id, user_id, role)
  values
    (v_mission_artemis, v_user_id, 'lead'),
    (v_mission_orion, v_user_id, 'operator')
  on conflict (mission_id, user_id) do update set role = excluded.role;

  insert into public.colonies (mission_id, name, code, location_label, status, environment_summary)
  values (
    v_mission_artemis,
    'Shackleton Base Alpha',
    'SBA-1',
    'Lunar South Pole — Shackleton Crater rim',
    'operational',
    'O2 stable · temp −23°C · pressure nominal'
  )
  on conflict (mission_id, code) do nothing
  returning id into v_colony_lda;

  if v_colony_lda is null then
    select id into v_colony_lda
    from public.colonies
    where mission_id = v_mission_artemis and code = 'SBA-1';
  end if;

  insert into public.colony_members (colony_id, user_id, role)
  values (v_colony_lda, v_user_id, 'operator')
  on conflict (colony_id, user_id) do nothing;

  insert into public.incidents (
    mission_id, colony_id, reporter_id, title, description, severity, status
  )
  select
    v_mission_artemis,
    v_colony_lda,
    v_user_id,
    'Pressure fluctuation in Module B',
    'Minor pressure variance detected during sleep cycle. Environmental systems compensating.',
    'medium',
    'investigating'
  where not exists (
    select 1 from public.incidents
    where mission_id = v_mission_artemis
      and title = 'Pressure fluctuation in Module B'
  );

  raise notice 'Seed complete for user %', v_user_id;
end;
$$;
