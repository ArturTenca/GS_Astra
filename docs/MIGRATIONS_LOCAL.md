# Local Supabase migrations (not in Git)

Apply these files **in order** from `supabase/migrations/` on your machine (files are gitignored).

| # | File |
|---|------|
| 1 | `20260528000000_profiles.sql` |
| 2 | `20260529100000_activate_profile_on_confirm.sql` |
| 3 | `20260530100000_core_domain.sql` |
| 4 | `20260530110000_incident_history_note.sql` |
| 5 | `20260530120000_incidents_select_reporter.sql` |
| 6 | `20260531100000_incident_attachments_storage.sql` |
| 7 | `20260601100000_audit_events.sql` |
| 8 | `20260602100000_domain_crud_policies.sql` |
| 9 | `20260603100000_alerts_telemetry.sql` |
| 10 | `20260604100000_alerts_deadline_crud.sql` |

Optional dev data: `supabase/seed.sql` (after first user exists).

Enable Realtime on table `alerts` in Supabase Dashboard → Database → Replication.
