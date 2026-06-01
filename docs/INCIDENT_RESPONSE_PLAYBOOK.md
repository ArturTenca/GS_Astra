# ASTRA — Security Incident Response Playbook

Operational guide for the academic cybersecurity chapter (containment → eradication → recovery).

## Roles

| Role | Responsibility |
|------|----------------|
| **Operator** | Report suspicious activity via in-app incident flow |
| **Mission lead** | Validate operational impact, coordinate mission pause if needed |
| **Security officer** | Triage, review `audit_events`, escalate |
| **System admin** | Supabase dashboard, RLS/policy fixes, account suspension |

## Severity classification

| Level | Examples | Target response |
|-------|----------|-----------------|
| S1 Critical | Confirmed data breach, mass account compromise | &lt; 1 h acknowledge, &lt; 4 h contain |
| S2 High | Single privileged account compromise, storage abuse | &lt; 4 h acknowledge, &lt; 24 h contain |
| S3 Medium | Failed MFA brute force, suspicious audit pattern | &lt; 24 h triage |
| S4 Low | Policy misconfiguration without exposure | Next maintenance window |

## Phase 1 — Preparation (ongoing)

- Maintain RLS policies and migration history in `supabase/migrations/`.
- Keep test accounts per role (see `PENTEST_CHECKLIST.md`).
- Document Supabase project owner and backup contacts.

## Phase 2 — Detection

1. Monitor `audit_events` (security_officer / system_admin in Profile).
2. Review Supabase Auth logs and Storage access in dashboard.
3. User reports via standard **Incidents** workflow (tag as security-related in description).

## Phase 3 — Containment

1. **Suspend** affected profile (`status = suspended`) via SQL or admin tooling.
2. **Revoke sessions:** Supabase Auth → sign out user / rotate secrets if service role was exposed (never in mobile app).
3. **Block upload path** if storage abuse: tighten bucket policy temporarily.
4. Record `security.access_denied` and related audit entries for timeline.

## Phase 4 — Eradication

1. Identify root cause (weak password, missing RLS, leaked env var).
2. Patch application or migration; redeploy mobile build if client bug.
3. Remove malicious rows/attachments after forensic snapshot.
4. Force password reset + MFA re-enrollment for affected accounts.

## Phase 5 — Recovery

1. Re-enable profiles after verification.
2. Validate RLS with role-based test accounts.
3. Run `npm run typecheck` and pentest checklist regression.
4. Communicate closure to stakeholders (mission leads).

## Phase 6 — Lessons learned

- Update `THREAT_MODEL.md` residual risks.
- Add regression test or migration if gap was structural.
- Archive timeline: audit export + Supabase logs.

## Communication template

```
Subject: [ASTRA Security] S{n} — {short title}

Detected: {UTC timestamp}
Impact: {data / users / missions affected}
Status: Investigating | Contained | Resolved
Next update: {time}
Contact: security_officer@...
```
