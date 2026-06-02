# ASTRA — Implementation Roadmap

## Completed (code + schema)

| Phase | Scope | Status |
|-------|--------|--------|
| **0 — Foundation** | Expo, Router, NativeWind, Supabase, errors, repos | Done |
| **1 — Auth** | Register, login, logout, SecureStore, guards, RLS | Done |
| **2a — Domain read** | Dashboard, missions, colonies, tabs, RLS, seed | Done |
| **2b — Incidents E2E** | Create, list, filters, detail, timeline, status, confirmation | Done |
| **3 — Mobile & polish** | GPS, camera/gallery attachments, draft (SecureStore), pull-to-refresh, skeletons | Done |
| **4 — Security (academic)** | Audit log, threat model, IR playbook, pentest checklist, optional MFA | Done |
| **5 — Enhancements (core)** | Alerts tab, realtime, acknowledgment, telemetry charts on dashboard | Done |
| **UX** | Popups (same tab), full CRUD missions/colonies/incidents | Done |

## Supabase setup

All migrations listed below are in `supabase/migrations/`. After applying them and `seed.sql`, follow **[VERIFICATION.md](./VERIFICATION.md)**.

| # | Migration | Purpose |
|---|-----------|---------|
| 1 | `20260528000000_profiles.sql` | Profiles + auth trigger |
| 2 | `20260529100000_activate_profile_on_confirm.sql` | Email activation |
| 3 | `20260530100000_core_domain.sql` | Missions, colonies, incidents |
| 4 | `20260530110000_incident_history_note.sql` | History notes |
| 5 | `20260530120000_incidents_select_reporter.sql` | Reporter read policy |
| 6 | `20260531100000_incident_attachments_storage.sql` | Photos + storage |
| 7 | `20260601100000_audit_events.sql` | Security audit log |
| 8 | `20260602100000_domain_crud_policies.sql` | CRUD RLS |
| 9 | `20260603100000_alerts_telemetry.sql` | Alerts + telemetry + realtime |
| 10 | `20260604100000_alerts_deadline_crud.sql` | Alert deadline (`active_until`) + CRUD RLS |

> Migrations are **gitignored** — apply from local `supabase/migrations/` per [MIGRATIONS_LOCAL.md](./MIGRATIONS_LOCAL.md).
| — | `seed.sql` | Demo data (re-run after signup) |

**Realtime:** enable replication for `public.alerts`.

## Phase 5 — Remaining (optional)

- [ ] Native push notifications → [PUSH_NOTIFICATIONS_SETUP.md](./PUSH_NOTIFICATIONS_SETUP.md)
- [ ] Edge Functions (signed uploads)
- [ ] Multi-org admin tooling

## MVP checklist (Global Solution)

| Requirement | Status |
|-------------|--------|
| 5+ screens | Done (login, register, dashboard, alerts, missions, colonies, incidents, profile) |
| Full user flow | Done (report → list → popup → edit/status → alerts) |
| Real data | Done (Supabase + RLS) |
| Native feature | Done (GPS + camera/gallery) |
| Validation / errors | Done |
| Project structure | Done |
| Cybersecurity chapter | Done (docs + audit + MFA) |

## App tabs

1. **Dashboard** — overview + telemetry  
2. **Alerts** — operational notifications  
3. **Missions** — CRUD + popup  
4. **Colonies** — CRUD + popup  
5. **Incidents** — report + CRUD + popup  
6. **Profile** — account, MFA, audit (roles security/admin)
