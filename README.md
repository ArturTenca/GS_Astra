# ASTRA

Futuristic mobile platform for space mission support, extraterrestrial colony operations, and critical mission monitoring.

## Tech stack

- React Native (Expo SDK 52)
- TypeScript
- Expo Router
- NativeWind (Tailwind CSS)
- Supabase (Auth, Postgres, RLS, Realtime, Storage)
- React Query
- Zustand
- Zod + React Hook Form

## Features

| Area | Capabilities |
|------|----------------|
| **Auth** | Register, login, logout, SecureStore, profile activation |
| **Missions / Colonies** | List, popup detail, create, edit, delete |
| **Incidents** | Report (GPS + photos), filters, popup, edit, delete, status timeline |
| **Alerts** | Realtime list, acknowledge, tab badge |
| **Dashboard** | Stats + colony telemetry charts |
| **Security** | Audit log, optional MFA (TOTP), academic docs |

## Prerequisites

- Node.js 20+
- npm
- Expo Go or a development build
- Supabase project (migrations applied)

## Setup

### 1. Install and env

```bash
npm install
cp .env.example .env
```

Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.

### 2. Supabase database

Run **all** migrations in order (SQL Editor or `supabase db push`):

1. `20260528000000_profiles.sql`
2. `20260529100000_activate_profile_on_confirm.sql`
3. `20260530100000_core_domain.sql`
4. `20260530110000_incident_history_note.sql`
5. `20260530120000_incidents_select_reporter.sql`
6. `20260531100000_incident_attachments_storage.sql`
7. `20260601100000_audit_events.sql`
8. `20260602100000_domain_crud_policies.sql`
9. `20260603100000_alerts_telemetry.sql`

Then register one user and run `supabase/seed.sql`.

Enable **Realtime** for table `alerts` (Database → Replication).

### 3. Run the app

```bash
npx expo start --clear
```

Press **`w`** for web, or scan the QR code with Expo Go.

### 4. Verify

See **[docs/VERIFICATION.md](docs/VERIFICATION.md)** for a full test checklist.

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run verify` | typecheck + lint |

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Implementation phases |
| [docs/VERIFICATION.md](docs/VERIFICATION.md) | Post-setup test checklist |
| [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) | Cybersecurity deliverable |
| [docs/INCIDENT_RESPONSE_PLAYBOOK.md](docs/INCIDENT_RESPONSE_PLAYBOOK.md) | IR playbook |
| [docs/PENTEST_CHECKLIST.md](docs/PENTEST_CHECKLIST.md) | Manual security tests |
| [docs/PUSH_NOTIFICATIONS_SETUP.md](docs/PUSH_NOTIFICATIONS_SETUP.md) | Optional native push |

## Project structure

```
src/
  app/           # Expo Router (tabs: dashboard, alerts, missions, colonies, incidents, profile)
  components/    # Shared UI
  features/      # Feature modules
  services/      # Repositories + audit
  lib/           # Supabase, errors, auth, permissions
  stores/        # Zustand (no tokens)
supabase/
  migrations/    # Ordered SQL migrations
  seed.sql       # Demo data
docs/            # Roadmap + academic + verification
```

## Security notes

- Auth tokens only in **Expo SecureStore** (never AsyncStorage).
- RLS on all tables; `service_role` never in the client.
- Roles from `profiles` table, not JWT user metadata.
- Never commit `.env`.

## Academic context

Built for Global Solution — mobile development, software architecture, and cybersecurity evaluation.
