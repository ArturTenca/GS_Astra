-- Auto-activate profile when email is confirmed (on login via RPC)
-- Also backfill existing confirmed users stuck in pending

create or replace function public.activate_own_profile_if_confirmed()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  confirmed_at timestamptz;
begin
  select u.email_confirmed_at
  into confirmed_at
  from auth.users as u
  where u.id = auth.uid();

  if confirmed_at is null then
    return false;
  end if;

  update public.profiles
  set status = 'active'
  where id = auth.uid()
    and status = 'pending';

  return true;
end;
$$;

revoke all on function public.activate_own_profile_if_confirmed() from public;
grant execute on function public.activate_own_profile_if_confirmed() to authenticated;

update public.profiles as p
set status = 'active'
from auth.users as u
where p.id = u.id
  and p.status = 'pending'
  and u.email_confirmed_at is not null;
