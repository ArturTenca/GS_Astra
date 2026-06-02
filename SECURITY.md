# Security policy — ASTRA

## Reporting

Do **not** open public GitHub issues for security vulnerabilities. Contact the project maintainers privately (course staff / team lead).

## Secrets

- Never commit `.env`, `.env.example`, or any env files with real keys.
- Never commit `supabase/migrations/*.sql` or `supabase/seed.sql` to a **public** repository.
- Never put the Supabase **service_role** key in the mobile app or in Git.

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Hardening summary

- Auth tokens: Expo SecureStore on iOS/Android (not AsyncStorage).
- Database access: Supabase anon key + Row Level Security only.
- See [docs/CYBER_SECURITY_AUDIT.md](docs/CYBER_SECURITY_AUDIT.md) for full audit.
