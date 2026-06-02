# Security checklist (ASTRA)

## Repository (before git push)

- [ ] No `.env` or `.env.*` tracked (only `.env.example`)
- [ ] No `supabase/migrations/*.sql` or `supabase/seed.sql` tracked
- [ ] `git ls-files | grep '\.sql'` returns empty
- [ ] No `service_role` in `src/`

## Mobile client

- [ ] No AsyncStorage for auth tokens
- [ ] No exposed secrets in logs (production)
- [ ] Zod validation on all forms
- [ ] RLS assumed on every Supabase table

## Supabase (private / dashboard)

- [ ] All migrations applied from local copy
- [ ] RLS enabled on every table
- [ ] Storage buckets: authenticated upload only
- [ ] Realtime limited to required tables

See [docs/CYBER_SECURITY_AUDIT.md](../docs/CYBER_SECURITY_AUDIT.md).
