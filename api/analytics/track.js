/**
 * Analytics Track API — Vercel Serverless Function
 * Stores events in Upstash Redis (free tier).
 * 
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */
async function redisCommand(url, token, command) {
    const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(command)
    });
    return res.json();
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
    const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!REDIS_URL || !REDIS_TOKEN) {
        // Redis not configured — silently accept but don't store
        return res.status(200).json({ ok: true, stored: false });
    }

    try {
        let body = req.body;
        // Handle sendBeacon (which sends as text/plain)
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const { type, sessionId, timestamp, toolId, toolName, endpoint, referrer, userAgent, screenWidth, screenHeight, language } = body;
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const hour = new Date().getHours();

        const pipeline = [];

        if (type === 'visit') {
            // Increment daily visit count
            pipeline.push(['HINCRBY', `stats:visits:${today}`, 'count', 1]);
            // Track unique sessions
            pipeline.push(['SADD', `stats:sessions:${today}`, sessionId]);
            // Track hourly distribution
            pipeline.push(['HINCRBY', `stats:hourly:${today}`, hour.toString(), 1]);
            // Store visitor info (last 100 only)
            pipeline.push(['LPUSH', 'stats:recent_visitors', JSON.stringify({
                sessionId, timestamp, referrer, userAgent: (userAgent || '').slice(0, 120), 
                screenWidth, screenHeight, language
            })]);
            pipeline.push(['LTRIM', 'stats:recent_visitors', 0, 99]);
            // Increment total visits ever
            pipeline.push(['INCR', 'stats:total_visits']);
        }

        if (type === 'tool_open' && toolId) {
            // Increment tool view count (all-time)
            pipeline.push(['HINCRBY', 'stats:tool_views', toolId, 1]);
            // Increment tool view count (today)
            pipeline.push(['HINCRBY', `stats:tool_views:${today}`, toolId, 1]);
            // Store tool name mapping
            if (toolName) {
                pipeline.push(['HSET', 'stats:tool_names', toolId, toolName]);
            }
        }

        if (type === 'api_call' && endpoint) {
            // Increment API call count (all-time)
            pipeline.push(['HINCRBY', 'stats:api_calls', endpoint, 1]);
            // Increment API call count (today)
            pipeline.push(['HINCRBY', `stats:api_calls:${today}`, endpoint, 1]);
            // Total API calls ever
            pipeline.push(['INCR', 'stats:total_api_calls']);
        }

        // Execute all commands via Upstash pipeline
        if (pipeline.length > 0) {
            await fetch(`${REDIS_URL}/pipeline`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${REDIS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pipeline)
            });
        }

        return res.status(200).json({ ok: true, stored: true });
    } catch (err) {
        console.error('Analytics track error:', err);
        return res.status(200).json({ ok: true, stored: false, error: err.message });
    }
};
