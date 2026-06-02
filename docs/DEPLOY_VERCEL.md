# Deploy ASTRA web on Vercel

Expo Router uses a **SPA** (`web.output: single`). Vercel must serve `index.html` for all routes and build into **`dist`**.

## Vercel project settings

| Setting | Value |
|---------|--------|
| Framework Preset | **Other** |
| Build Command | `npm run build:web` (or use root `vercel.json`) |
| Output Directory | **`dist`** |
| Install Command | `npm install` |

## Environment variables (required)

In Vercel → Project → Settings → Environment Variables, add for **Production** and **Preview**:

| Name | Value |
|------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** key (not `service_role`) |

Redeploy after adding variables.

## 404 on refresh or deep links

Fixed by `vercel.json` rewrites: all paths fall back to `/` so Expo Router handles routing client-side.

If you still see 404:

1. Confirm **Output Directory** is `dist`, not `web-build` or `.expo`.
2. Confirm the latest deployment build **succeeded**.
3. Open `/` first — if root works but `/login` fails, rewrites are missing; ensure `vercel.json` is committed.

## Local test before deploy

```bash
npm run build:web
npx serve dist
```

Visit `http://localhost:3000` and `http://localhost:3000/login` — both should load the app.
