# Database migrations (local / private)

**Do not commit `*.sql` from this folder to a public GitHub repository.**

SQL migrations expose table structure, RLS policies, and security definer functions. Keep them in:

- This folder on your machine (gitignored), or
- A **private** repo / password manager / team vault, or
- Supabase Dashboard → SQL Editor (applied manually)

## Apply order

See **[docs/MIGRATIONS_LOCAL.md](../../docs/MIGRATIONS_LOCAL.md)** for the numbered list of files.

After all migrations, run `supabase/seed.sql` locally (also gitignored) only in dev/staging — never with production secrets in a public artifact.

## Environment

Copy `.env.example` → `.env` (root). Never commit `.env`.
