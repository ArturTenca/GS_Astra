# Deploy ASTRA web on Netlify

Expo Router uses a **SPA** (`web.output: single`). Netlify must serve `index.html` for app routes and publish the **`dist`** folder.

## Netlify project settings

| Setting | Value |
|---------|--------|
| Build command | `npx expo export -p web` (or leave empty — `netlify.toml` sets this) |
| Publish directory | `dist` |
| Node version | 20 (set in `netlify.toml`) |

If the Netlify UI overrides build settings, align them with `netlify.toml` or clear the overrides so the file in the repo applies.

## Environment variables (required)

In Netlify → Site configuration → Environment variables, add for **Production** and **Deploy previews**:

| Name | Value |
|------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** key (never `service_role`) |

Redeploy after adding or changing variables (Expo inlines `EXPO_PUBLIC_*` at build time).

## 404 on refresh or deep links

Fixed by `netlify.toml` redirect: routes like `/alerts` and `/missions` rewrite to `/index.html` with status 200. Static assets under `/_expo/` are served as files before the redirect runs.

If you still see 404:

1. Confirm **Publish directory** is `dist`, not `web-build` or `.expo`.
2. Confirm the latest deploy **succeeded**.
3. Ensure `netlify.toml` is committed and trigger a new deploy.
4. Test locally: `npm run build:web` then `npx serve dist` — `/alerts` should load the app.

## Security headers

`netlify.toml` sets CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, and `Permissions-Policy` on all responses.

## Local test before deploy

```bash
npm run build:web
npx serve dist
```

Visit `http://localhost:3000` and `http://localhost:3000/alerts` — both should load the app.
