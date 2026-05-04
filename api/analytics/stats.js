/**
 * Analytics Stats API — Vercel Serverless Function
 * Returns aggregated analytics data from Upstash Redis.
 * Protected by ADMIN_PASSWORD env var.
 */
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    // Password protection
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (ADMIN_PASSWORD) {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace('Bearer ', '');
        if (token !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
    const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!REDIS_URL || !REDIS_TOKEN) {
        return res.status(200).json({ 
            configured: false, 
            message: 'Analytics not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to environment variables.' 
        });
    }

    try {
        const today = new Date().toISOString().slice(0, 10);
        
        // Generate last 7 days keys
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().slice(0, 10));
        }

        const pipeline = [
            // Total visits
            ['GET', 'stats:total_visits'],
            // Total API calls
            ['GET', 'stats:total_api_calls'],
            // Tool views (all-time)
            ['HGETALL', 'stats:tool_views'],
            // API calls breakdown (all-time)
            ['HGETALL', 'stats:api_calls'],
            // Tool name mapping
            ['HGETALL', 'stats:tool_names'],
            // Today's unique sessions
            ['SCARD', `stats:sessions:${today}`],
            // Today's hourly distribution
            ['HGETALL', `stats:hourly:${today}`],
            // Recent visitors
            ['LRANGE', 'stats:recent_visitors', 0, 19],
        ];

        // Add daily visit counts for last 7 days
        for (const day of days) {
            pipeline.push(['HGET', `stats:visits:${day}`, 'count']);
        }

        // Add daily tool views for today
        pipeline.push(['HGETALL', `stats:tool_views:${today}`]);
        // Add daily API calls for today
        pipeline.push(['HGETALL', `stats:api_calls:${today}`]);

        const pipelineRes = await fetch(`${REDIS_URL}/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pipeline)
        });

        const results = await pipelineRes.json();

        // Parse results
        const totalVisits = parseInt(results[0]?.result || '0');
        const totalApiCalls = parseInt(results[1]?.result || '0');
        
        // Parse HGETALL results (returns flat array [key, value, key, value, ...])
        const parseHash = (arr) => {
            const obj = {};
            if (!arr || !Array.isArray(arr)) return obj;
            for (let i = 0; i < arr.length; i += 2) {
                obj[arr[i]] = parseInt(arr[i + 1]) || arr[i + 1];
            }
            return obj;
        };

        const toolViews = parseHash(results[2]?.result);
        const apiCalls = parseHash(results[3]?.result);
        const toolNames = parseHash(results[4]?.result);
        const todayUniqueSessions = parseInt(results[5]?.result || '0');
        const hourlyDistribution = parseHash(results[6]?.result);
        
        // Recent visitors
        let recentVisitors = [];
        try {
            recentVisitors = (results[7]?.result || []).map(v => JSON.parse(v));
        } catch { /* ignore */ }

        // Daily visits for last 7 days
        const dailyVisits = {};
        for (let i = 0; i < days.length; i++) {
            dailyVisits[days[i]] = parseInt(results[8 + i]?.result || '0');
        }

        const todayToolViews = parseHash(results[8 + days.length]?.result);
        const todayApiCalls = parseHash(results[9 + days.length]?.result);

        return res.status(200).json({
            configured: true,
            totalVisits,
            totalApiCalls,
            todayUniqueSessions,
            toolViews,
            apiCalls,
            toolNames,
            hourlyDistribution,
            dailyVisits,
            todayToolViews,
            todayApiCalls,
            recentVisitors
        });
    } catch (err) {
        console.error('Analytics stats error:', err);
        return res.status(500).json({ error: err.message });
    }
};
