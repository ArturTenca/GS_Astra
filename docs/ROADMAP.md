# ASTRA — Implementation Roadmap

## Completed

| Phase | Scope | Status |
|-------|--------|--------|
| **0 — Foundation** | Expo, Router, NativeWind, Supabase, errors, repos | Done |
| **1 — Auth** | Register, login, logout, SecureStore, guards, RLS | Done |
| **2a — Domain read** | Dashboard, missions, colonies, tabs, RLS, seed | Done |
| **2b — Incidents E2E** | Create, list, filters, detail, timeline, status, confirmation | Done |
| **3 — Mobile & polish** | GPS, camera/gallery attachments, draft (SecureStore), pull-to-refresh, skeletons | Done |
| **4 — Security (academic)** | Audit log, threat model, IR playbook, pentest checklist, optional MFA | Done |

## Phase 5 — Enhancements

- [ ] Push notifications + alerts tab
- [ ] Realtime telemetry charts
- [ ] Alerts acknowledgment
- [ ] Edge Functions (signed uploads)
- [ ] Multi-org admin tooling

---

## Supabase setup (all phases)

1. `20260528000000_profiles.sql`
2. `20260529100000_activate_profile_on_confirm.sql`
3. `20260530100000_core_domain.sql`
4. `20260530110000_incident_history_note.sql`
5. `20260530120000_incidents_select_reporter.sql`
6. `20260531100000_incident_attachments_storage.sql`
7. `20260601100000_audit_events.sql`
8. `supabase/seed.sql` (after first user exists)

## MVP checklist (Global Solution)

| Requirement | Status |
|-------------|--------|
| 5+ screens | Done (auth, dashboard, missions, colonies, incidents, profile) |
| Full user flow | Done (report → list → detail → status → confirmation) |
| Real data | Done (Supabase + RLS) |
| Native feature | Done (GPS + camera/gallery on incident report) |
| Validation / errors | Done |
| Project structure | Done |
