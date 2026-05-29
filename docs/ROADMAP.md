# ASTRA — Implementation Roadmap

## Completed

| Phase | Scope | Status |
|-------|--------|--------|
| **0 — Foundation** | Expo, Router, NativeWind, Supabase, errors, repos | Done |
| **1 — Auth** | Register, login, logout, SecureStore, guards, RLS | Done |
| **2a — Domain read** | Dashboard, missions, colonies, tabs, RLS, seed | Done |
| **2b — Incidents E2E** | Create, list, filters, detail, timeline, status, confirmation | Done |

## Next — Phase 3 (Mobile & polish)

- [ ] GPS on incident (`expo-location`, permission denied handling)
- [ ] Camera / gallery attachments (`incident_attachments` + Storage RLS)
- [ ] Push notifications (alerts tab)
- [ ] Offline incident draft queue
- [ ] Pull-to-refresh, skeleton loaders

## Phase 4 — Security hardening (academic)

- [ ] `audit_events` table + client logging
- [ ] `docs/THREAT_MODEL.md`
- [ ] Incident response playbook
- [ ] Pentest checklist + test accounts per role
- [ ] Optional MFA (Supabase TOTP)

## Phase 5 — Enhancements

- [ ] Realtime telemetry charts
- [ ] Alerts acknowledgment
- [ ] Edge Functions (signed uploads)
- [ ] Multi-org admin tooling

---

## Supabase setup (all phases)

1. `20260528000000_profiles.sql`
2. `20260529100000_activate_profile_on_confirm.sql`
3. `20260530100000_core_domain.sql`
4. `supabase/seed.sql`

## MVP checklist (Global Solution)

| Requirement | Status |
|-------------|--------|
| 5+ screens | Done (auth, dashboard, missions, colonies, incidents, profile) |
| Full user flow | Done (report → list → detail → status → confirmation) |
| Real data | Done (Supabase + RLS) |
| Native feature | Phase 3 (GPS/camera) |
| Validation / errors | Done |
| Project structure | Done |
