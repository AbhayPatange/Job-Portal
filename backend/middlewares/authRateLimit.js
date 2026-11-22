// Bounded per-process limiter; use a shared store when scaling to multiple instances.
const attempts = new Map();
export function authRateLimit(req, res, next) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    const key = req.ip;
    const current = attempts.get(key) || { count: 0, expires: now + 15 * 60 * 1000 };
    if (current.count >= 20 || (!attempts.has(key) && attempts.size >= 10000)) {
        res.set('Retry-After', '900');
        return res.status(429).json({ success: false, message: 'Too many attempts. Please try again in 15 minutes.' });
    }
    current.count++;
    attempts.set(key, current);
    next();
}
