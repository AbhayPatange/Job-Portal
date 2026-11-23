const REMOTIVE_URL = 'https://remotive.com/api/remote-jobs';
const CACHE_MS = 6 * 60 * 60 * 1000;
let cachedJobs = [];
let cachedAt = 0;

function normalizeJob(job) {
  return {
    id: String(job.id), title: job.title || 'Open role', company: job.company_name || 'Company not listed',
    location: job.candidate_required_location || 'Remote', type: job.job_type || 'Opportunity',
    category: job.category || 'Remote work', publishedAt: job.publication_date || null, url: job.url,
  };
}

export async function getExternalJobs(req, res) {
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 12) : 6;
  if (cachedJobs.length && Date.now() - cachedAt < CACHE_MS) return res.json({ success: true, source: 'Remotive', jobs: cachedJobs.slice(0, limit), cached: true });
  try {
    const response = await fetch(REMOTIVE_URL, { signal: AbortSignal.timeout(9000) });
    if (!response.ok) throw new Error(`Remote feed returned ${response.status}`);
    const payload = await response.json();
    cachedJobs = Array.isArray(payload.jobs) ? payload.jobs.filter((job) => job?.url).map(normalizeJob) : [];
    cachedAt = Date.now();
    return res.json({ success: true, source: 'Remotive', jobs: cachedJobs.slice(0, limit), cached: false });
  } catch (error) {
    // Preserve a previously fetched feed when the source is temporarily unavailable.
    if (cachedJobs.length) return res.json({ success: true, source: 'Remotive', jobs: cachedJobs.slice(0, limit), cached: true });
    return res.status(503).json({ success: false, message: 'Live opportunities are temporarily unavailable.' });
  }
}
