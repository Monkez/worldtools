import { getApiBase } from './apiBase.js';

/**
 * Lightweight analytics tracker.
 * Sends anonymous events to the serverless analytics API.
 * Falls back gracefully if the API is unavailable.
 */
class Analytics {
    static _sessionId = null;

    static getSessionId() {
        if (!this._sessionId) {
            this._sessionId = sessionStorage.getItem('wt_session_id');
            if (!this._sessionId) {
                this._sessionId = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
                sessionStorage.setItem('wt_session_id', this._sessionId);
            }
        }
        return this._sessionId;
    }

    /**
     * Track a page/tool view
     */
    static trackToolOpen(toolId, toolName) {
        // Also store locally for offline/Electron usage
        this._incrementLocal('tool_views', toolId);
        this._sendEvent('tool_open', { toolId, toolName });
    }

    /**
     * Track an API call
     */
    static trackApiCall(endpoint) {
        this._incrementLocal('api_calls', endpoint);
        this._sendEvent('api_call', { endpoint });
    }

    /**
     * Track a page visit (called once per session)
     */
    static trackVisit() {
        const visited = sessionStorage.getItem('wt_visit_tracked');
        if (!visited) {
            sessionStorage.setItem('wt_visit_tracked', '1');
            this._sendEvent('visit', {
                referrer: document.referrer || 'direct',
                userAgent: navigator.userAgent,
                screenWidth: screen.width,
                screenHeight: screen.height,
                language: navigator.language
            });
        }
    }

    /**
     * Get local analytics data (for admin page fallback)
     */
    static getLocalStats() {
        try {
            const toolViews = JSON.parse(localStorage.getItem('wt_analytics_tool_views') || '{}');
            const apiCalls = JSON.parse(localStorage.getItem('wt_analytics_api_calls') || '{}');
            return { toolViews, apiCalls };
        } catch {
            return { toolViews: {}, apiCalls: {} };
        }
    }

    // --- Private ---

    static _incrementLocal(category, key) {
        try {
            const storageKey = `wt_analytics_${category}`;
            const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
            data[key] = (data[key] || 0) + 1;
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch { /* ignore */ }
    }

    static _sendEvent(type, data) {
        try {
            const payload = JSON.stringify({
                type,
                sessionId: this.getSessionId(),
                timestamp: Date.now(),
                ...data
            });
            // Use sendBeacon for non-blocking fire-and-forget
            if (navigator.sendBeacon) {
                navigator.sendBeacon(`${getApiBase()}/api/analytics/track`, payload);
            } else {
                fetch(`${getApiBase()}/api/analytics/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true
                }).catch(() => {});
            }
        } catch { /* silently fail */ }
    }
}

export default Analytics;
