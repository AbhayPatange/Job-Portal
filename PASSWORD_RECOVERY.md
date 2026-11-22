# Password recovery deployment

Set these environment variables on the existing Render backend:

- `RESEND_API_KEY`: an email-sending API key from your Resend account.
- `RESET_EMAIL_FROM`: a sender on your verified Resend domain, e.g. `Job Portal <passwords@example.com>`.
- `FRONTEND_URL`: the stable production Vercel origin, `https://jobportal-abhayproject.vercel.app`.

Redeploy Render after saving. Never commit the API key. Without these values the endpoint returns 503 and the UI explains that recovery is unavailable.

Verify delivery using an account you own: request a link, open it, change the password, sign in with the new password, and verify the same link cannot be reused. Old sessions are invalidated. Links expire after 15 minutes. The API always gives the same accepted response for existing and nonexistent accounts; email delivery failures are recorded without secrets in server logs.

Run backend recovery checks with `node --test backend/tests/password.test.js` and frontend compilation with `npm run build --prefix frontend`.

The auth attempt limiter is per process (20 requests per IP per 15 minutes). Use a shared limiter store if the backend is scaled across instances. Cross-site cookies require browsers to permit the app's cookies; a same-site custom API domain avoids third-party-cookie restrictions.
