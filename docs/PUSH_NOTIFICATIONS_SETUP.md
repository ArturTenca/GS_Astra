# Push notifications (Phase 5 — optional setup)

In-app **Alerts** with Realtime are fully implemented. Native push requires extra platform setup:

## 1. Install

```bash
npx expo install expo-notifications expo-device
```

## 2. `app.config.ts`

Add the `expo-notifications` plugin and configure `android.googleServicesFile` / iOS push capabilities when using EAS Build.

## 3. Supabase

- Store device tokens in a `profile_push_tokens` table (not included in MVP migration).
- Send pushes from an **Edge Function** triggered on `alerts` insert (service role only).

## 4. Security

- Never expose `service_role` in the mobile app.
- Validate `user_id` when saving push tokens (RLS: own row only).

Until this is configured, use the **Alerts** tab and tab badge for pending notifications.
