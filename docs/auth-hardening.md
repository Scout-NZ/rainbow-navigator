# Auth Hardening — Phase A

Code-side (done):
- Signup enforces a 10+ character password floor (length beats complexity)
- Google OAuth promoted as the default sign-in; hardened email retained so
  closeted users never have to link a real-identity account
- Safety reports work without any account

Dashboard settings (owner action — Supabase Dashboard → Authentication):
1. **Sign In / Providers → Email**: turn ON "Confirm email" so unverified
   addresses can't participate
2. **Settings → Security**: turn ON leaked-password protection
   (HaveIBeenPwned check) and set minimum password length to 10 so the
   server enforces what the client asks for
3. **Multi-Factor Auth**: enable TOTP (app-based codes)

Follow-ups (Phase A.2, code):
- 2FA enrolment UI in Profile → Security (supabase.auth.mfa)
- Require an enrolled factor for accounts with profiles.is_admin
- "Sign out everywhere" button in Profile
