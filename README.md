# ASTRA

Futuristic mobile platform for space mission support, extraterrestrial colony operations, and critical mission monitoring.

## Tech stack

- React Native (Expo SDK 52)
- TypeScript
- Expo Router
- NativeWind (Tailwind CSS)
- Supabase (Auth, Postgres, RLS)
- React Query
- Zustand
- Zod + React Hook Form

## Prerequisites

- Node.js 20+
- npm
- Expo Go or a development build
- Supabase project

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings.

3. Apply database migration (Supabase CLI or SQL editor):

   ```bash
   supabase db push
   ```

   Or run `supabase/migrations/20260528000000_profiles.sql` in the Supabase SQL editor.

4. Apply database migrations (Supabase CLI or SQL editor):

   Run all migrations in order:
   - `supabase/migrations/20260528000000_profiles.sql`
   - `supabase/migrations/20260529100000_activate_profile_on_confirm.sql`
   - `supabase/migrations/20260530100000_core_domain.sql`

   Then run `supabase/seed.sql` for demo missions/colonies.

   Or: `supabase db push`

5. Enable email auth in Supabase Dashboard. After confirming your email, login will auto-activate your profile.

5. Start the app:

   ```bash
   npx expo start --clear
   ```

   Press **`w`** for web, or scan QR code with Expo Go.

## Troubleshooting (web)

If you see **500** or **MIME type application/json** errors in the browser:

1. Ensure dependencies match Expo SDK 52:

   ```bash
   npx expo install expo-asset expo-font @expo/metro-runtime
   npm install
   ```

2. Clear Metro cache: `npx expo start --clear`

3. `nativewind` must stay on **4.1.23** (4.2.x requires Reanimated 4 / worklets).

Common Metro errors fixed in this project:

- `react-native-worklets/plugin` → pin `nativewind@4.1.23`
- `@opentelemetry/api` → required by `@supabase/supabase-js` on web
- `expo-font` → required by Expo Router web

## Scripts

| Script            | Description                |
| ----------------- | -------------------------- |
| `npm start`       | Start Expo dev server      |
| `npm run typecheck` | TypeScript check           |
| `npm run lint`    | ESLint                     |
| `npm run format`  | Prettier                   |

## Project structure

```
src/
  app/           # Expo Router routes
  components/    # Shared UI + providers
  features/      # Feature modules (auth, etc.)
  services/      # Repositories
  lib/           # Supabase, errors, auth, env
  stores/        # Zustand (no tokens)
  theme/         # Design tokens
supabase/        # Migrations
```

## Security notes

- Auth tokens are stored in **Expo SecureStore only** (never AsyncStorage).
- User-facing auth errors are generic (no account enumeration).
- Roles are loaded from `profiles` via RLS (not JWT user metadata).
- Never commit `.env` or `service_role` keys.

## Academic context

Built for Global Solution — mobile development, software architecture, and cybersecurity evaluation.
