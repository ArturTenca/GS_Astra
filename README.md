# ASTRA

Futuristic mobile platform for space mission support, extraterrestrial colony operations, and critical mission monitoring.

## Integrantes 

Victor Mattenhauer Lopes Capp RM 555753

Artur Alves Tenca RM 555171

Igor Brunelli Ralo RM 555035

João Pedro Signor Avelar RM 558375

Roger Cardoso Ferreira RM 557230

## Vídeo Explicativo (MOBILE):

https://www.youtube.com/watch?v=X842K9rdVpQ

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
| **Alerts** | CRUD, calendar deadline, realtime, acknowledge |
| **Dashboard** | Stats + colony telemetry charts |
| **Security** | Audit log, optional MFA (TOTP), academic docs |
| **Landing (web)** | Marketing page for unauthenticated visitors (Netlify) |

## Prerequisites

- Node.js 20+
- npm
- Expo Go or a development build
- Supabase project (migrations applied)

## Setup

### 1. Install and env

```bash
npm install
```

Create a local `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` — see **[docs/ENV_SETUP.md](docs/ENV_SETUP.md)**.

### 2. Supabase database

SQL migrations are **not committed to Git** (security). Keep `supabase/migrations/*.sql` on your machine and apply in order — see **[docs/MIGRATIONS_LOCAL.md](docs/MIGRATIONS_LOCAL.md)** (SQL Editor or private `supabase db push`).

Then register one user and run `supabase/seed.sql` locally (dev only, also gitignored).

Enable **Realtime** for table `alerts` (Database → Replication).

### 3. Run the app

```bash
npx expo start --clear
```

### Web deploy (Netlify)

See **[docs/DEPLOY_NETLIFY.md](docs/DEPLOY_NETLIFY.md)**. Build: `npx expo export -p web` → output `dist`. Set Supabase env vars on Netlify.

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
| [docs/CYBER_SECURITY_AUDIT.md](docs/CYBER_SECURITY_AUDIT.md) | Security audit + Git hygiene |
| [docs/MIGRATIONS_LOCAL.md](docs/MIGRATIONS_LOCAL.md) | Migration order (SQL stays local) |
| [docs/ENV_SETUP.md](docs/ENV_SETUP.md) | Local `.env` variables (not in Git) |
| [docs/DEPLOY_NETLIFY.md](docs/DEPLOY_NETLIFY.md) | Web deploy on Netlify (SPA + headers) |
| [SECURITY.md](SECURITY.md) | GitHub security policy |

## Project structure

```
src/
  app/           # Expo Router (auth, app tabs, web landing at /)
  components/    # Shared UI
  features/      # Feature modules (incl. landing for web)
  services/      # Repositories + audit
  lib/           # Supabase, errors, auth, permissions
  stores/        # Zustand (no tokens)
supabase/
  migrations/    # SQL files local only (gitignored) — see docs/MIGRATIONS_LOCAL.md
  seed.sql       # Dev seed (gitignored)
docs/            # Roadmap + academic + verification
assets/landing/  # Hero image for web landing (AVIF)
```

## Security notes

- Auth tokens only in **Expo SecureStore** on device (never AsyncStorage).
- RLS on all tables; **`service_role` never in the client** (enforced in `src/lib/env.ts`).
- Roles from `profiles` table, not JWT user metadata.
- **Never commit** `.env` or `supabase/migrations/*.sql` to public GitHub.
- Full audit: **[docs/CYBER_SECURITY_AUDIT.md](docs/CYBER_SECURITY_AUDIT.md)**.

## Academic context

Built for Global Solution — mobile development, software architecture, and cybersecurity evaluation.
