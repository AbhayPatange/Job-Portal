# CarrerNex AI résumé fit assistant

This feature gives signed-in candidates private, evidence-based coaching for a specific job. It does **not** assign a score, rank candidates, or make a hiring decision.

## Before enabling it in Render

Add these backend environment variables in the Render service dashboard:

```text
AI_FIT_ENABLED=true
GROQ_API_KEY=your_server-side_Groq_key
GROQ_FIT_MODEL=openai/gpt-oss-20b
```

Create a Groq free-tier key in the [Groq console](https://console.groq.com/keys). Keep `GROQ_API_KEY` only in Render (never in Vercel, Git, browser code, or chat). Redeploy Render after saving the values. Until then, the job page deliberately shows a “coming soon” state and does not send résumé text.

## Privacy and controls

- Candidates must review editable extracted/pasted text and explicitly consent before any request.
- The browser removes common emails, telephone numbers, links, and labelled personal details; the server redacts them again.
- Only reviewed résumé text and job-related job fields are sent to Groq. User IDs, applications, and original PDF files are not sent.
- Requests use `store: false`; the server does not log résumé text or provider response bodies.
- Usage is limited to 5 requests per candidate/day and 50 requests globally/day (UTC), plus the existing request limiter.
- Scanned PDFs with no selectable text prompt the candidate to paste text instead.

The implementation follows Groq's [free-tier billing FAQ](https://console.groq.com/docs/billing-faqs), [structured outputs guide](https://console.groq.com/docs/structured-outputs), and [API key guidance](https://console.groq.com/docs/quickstart).
