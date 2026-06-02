# Environment variables (local only)

Create a `.env` file in the project root (gitignored). **Do not commit it.**

Required variables:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Use only the Supabase **anon (public)** key — never `service_role`.

For Vercel, set the same names in Project → Settings → Environment Variables.
