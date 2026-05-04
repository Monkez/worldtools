/**
 * Shared utility: detect API base URL
 * - Electron (file:// protocol): use http://127.0.0.1:3000
 * - Web (http/https): use relative URL (same origin)
 */
export function getApiBase() {
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        return 'http://127.0.0.1:3000';
    }
    return ''; // relative — same origin on Vercel/web
}
