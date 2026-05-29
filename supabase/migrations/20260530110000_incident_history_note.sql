-- Allow operators to attach a note to their own most recent history entry

create policy "incident_history_update_own"
  on public.incident_status_history
  for update
  to authenticated
  using (changed_by = auth.uid())
  with check (changed_by = auth.uid());
