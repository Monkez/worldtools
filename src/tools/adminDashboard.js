import { getApiBase } from '../utils/apiBase.js';
import Analytics from '../utils/analytics.js';

export function renderAdminDashboard(container) {
    container.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
            <!-- Auth Gate -->
            <div id="admin-auth" style="text-align: center; padding: 80px 20px;">
                <i class='bx bx-lock-alt' style="font-size: 64px; color: var(--accent-color); margin-bottom: 16px;"></i>
                <h2 style="color: #fff; margin-bottom: 8px;">Admin Dashboard</h2>
                <p style="color: var(--text-secondary); margin-bottom: 32px;">Enter admin password to view analytics.</p>
                <div style="display: flex; gap: 12px; max-width: 400px; margin: 0 auto;">
                    <input type="password" id="admin-password" class="input-field" placeholder="Admin Password" style="flex: 1; height: 48px;">
                    <button id="admin-login-btn" class="btn-primary" style="height: 48px; padding: 0 24px;">
                        <i class='bx bx-log-in'></i> Access
                    </button>
                </div>
                <p id="admin-auth-error" style="color: #ef4444; margin-top: 12px; display: none;"></p>
                <div style="margin-top: 32px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <p style="color: var(--text-secondary); font-size: 13px; margin: 0;">
                        <i class='bx bx-info-circle'></i> Set <code style="color: var(--accent-color);">ADMIN_PASSWORD</code> in Vercel Environment Variables.
                    </p>
                </div>
            </div>

            <!-- Dashboard Content (hidden until auth) -->
            <div id="admin-dashboard" style="display: none;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="color: #fff; margin: 0; font-size: 24px;">📊 Analytics Dashboard</h2>
                        <p id="admin-last-updated" style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;"></p>
                    </div>
                    <button id="admin-refresh-btn" class="btn-secondary" style="padding: 8px 16px;">
                        <i class='bx bx-refresh'></i> Refresh
                    </button>
                </div>

                <!-- Stats Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="admin-stat-card" style="background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05)); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 20px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(99,102,241,0.2); display: flex; align-items: center; justify-content: center;">
                                <i class='bx bx-globe' style="font-size: 22px; color: #818cf8;"></i>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 13px;">Total Visits</span>
                        </div>
                        <div id="stat-total-visits" style="font-size: 32px; font-weight: 700; color: #fff;">--</div>
                    </div>

                    <div class="admin-stat-card" style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05)); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 20px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(16,185,129,0.2); display: flex; align-items: center; justify-content: center;">
                                <i class='bx bx-user' style="font-size: 22px; color: #34d399;"></i>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 13px;">Today Unique</span>
                        </div>
                        <div id="stat-today-sessions" style="font-size: 32px; font-weight: 700; color: #fff;">--</div>
                    </div>

                    <div class="admin-stat-card" style="background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05)); border: 1px solid rgba(245,158,11,0.2); border-radius: 12px; padding: 20px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(245,158,11,0.2); display: flex; align-items: center; justify-content: center;">
                                <i class='bx bx-server' style="font-size: 22px; color: #fbbf24;"></i>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 13px;">Total API Calls</span>
                        </div>
                        <div id="stat-total-api" style="font-size: 32px; font-weight: 700; color: #fff;">--</div>
                    </div>

                    <div class="admin-stat-card" style="background: linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05)); border: 1px solid rgba(236,72,153,0.2); border-radius: 12px; padding: 20px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(236,72,153,0.2); display: flex; align-items: center; justify-content: center;">
                                <i class='bx bx-grid-alt' style="font-size: 22px; color: #f472b6;"></i>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 13px;">Tools Used</span>
                        </div>
                        <div id="stat-tools-count" style="font-size: 32px; font-weight: 700; color: #fff;">--</div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <!-- Daily Visits Chart -->
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px;">
                        <h3 style="color: #fff; margin: 0 0 16px; font-size: 15px;">
                            <i class='bx bx-line-chart' style="color: var(--accent-color);"></i> Visits (Last 7 Days)
                        </h3>
                        <div id="chart-daily-visits" style="height: 180px; display: flex; align-items: flex-end; gap: 8px; padding-top: 16px;"></div>
                    </div>

                    <!-- Hourly Distribution -->
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px;">
                        <h3 style="color: #fff; margin: 0 0 16px; font-size: 15px;">
                            <i class='bx bx-time-five' style="color: #10b981;"></i> Today by Hour
                        </h3>
                        <div id="chart-hourly" style="height: 180px; display: flex; align-items: flex-end; gap: 2px; padding-top: 16px;"></div>
                    </div>
                </div>

                <!-- Tool Usage & API Calls -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <!-- Tool Usage Ranking -->
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px;">
                        <h3 style="color: #fff; margin: 0 0 16px; font-size: 15px;">
                            <i class='bx bx-bar-chart-alt-2' style="color: #f59e0b;"></i> Tool Popularity (All-Time)
                        </h3>
                        <div id="chart-tool-views" style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;"></div>
                    </div>

                    <!-- API Calls Breakdown -->
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px;">
                        <h3 style="color: #fff; margin: 0 0 16px; font-size: 15px;">
                            <i class='bx bx-code-curly' style="color: #ec4899;"></i> API Calls Breakdown
                        </h3>
                        <div id="chart-api-calls" style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;"></div>
                    </div>
                </div>

                <!-- Recent Visitors -->
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <h3 style="color: #fff; margin: 0 0 16px; font-size: 15px;">
                        <i class='bx bx-group' style="color: #06b6d4;"></i> Recent Visitors
                    </h3>
                    <div id="recent-visitors-list" style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <thead>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <th style="text-align: left; padding: 10px 12px; color: var(--text-secondary); font-weight: 500;">Time</th>
                                    <th style="text-align: left; padding: 10px 12px; color: var(--text-secondary); font-weight: 500;">Screen</th>
                                    <th style="text-align: left; padding: 10px 12px; color: var(--text-secondary); font-weight: 500;">Language</th>
                                    <th style="text-align: left; padding: 10px 12px; color: var(--text-secondary); font-weight: 500;">Referrer</th>
                                    <th style="text-align: left; padding: 10px 12px; color: var(--text-secondary); font-weight: 500;">Browser</th>
                                </tr>
                            </thead>
                            <tbody id="visitors-tbody"></tbody>
                        </table>
                    </div>
                </div>

                <!-- Not Configured Warning -->
                <div id="admin-not-configured" style="display: none; text-align: center; padding: 48px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); border-radius: 12px; margin-bottom: 24px;">
                    <i class='bx bx-cloud-upload' style="font-size: 48px; color: #f59e0b; margin-bottom: 16px;"></i>
                    <h3 style="color: #fff; margin-bottom: 8px;">Analytics Not Configured</h3>
                    <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 24px; line-height: 1.6;">
                        To enable server-side analytics tracking, add these environment variables to your Vercel project:
                    </p>
                    <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 16px; display: inline-block; text-align: left; font-family: monospace; font-size: 14px;">
                        <div style="color: #fbbf24;">UPSTASH_REDIS_REST_URL</div>
                        <div style="color: #fbbf24;">UPSTASH_REDIS_REST_TOKEN</div>
                        <div style="color: var(--text-secondary); margin-top: 8px;">ADMIN_PASSWORD <span style="color: #6b7280;">(optional)</span></div>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-top: 16px;">
                        Get a free Redis database at <a href="https://upstash.com" target="_blank" style="color: var(--accent-color);">upstash.com</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    // --- Logic ---
    const authGate = container.querySelector('#admin-auth');
    const dashboard = container.querySelector('#admin-dashboard');
    const passwordInput = container.querySelector('#admin-password');
    const loginBtn = container.querySelector('#admin-login-btn');
    const authError = container.querySelector('#admin-auth-error');
    const refreshBtn = container.querySelector('#admin-refresh-btn');
    const notConfigured = container.querySelector('#admin-not-configured');

    let adminToken = sessionStorage.getItem('wt_admin_token') || '';

    // If already authenticated in this session, skip login
    if (adminToken) {
        authGate.style.display = 'none';
        dashboard.style.display = 'block';
        loadDashboardData(adminToken);
    }

    loginBtn.addEventListener('click', () => tryLogin());
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryLogin();
    });

    async function tryLogin() {
        const pw = passwordInput.value.trim();
        if (!pw) {
            authError.textContent = 'Please enter a password.';
            authError.style.display = 'block';
            return;
        }

        loginBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Checking...";
        loginBtn.disabled = true;

        try {
            const res = await fetch(`${getApiBase()}/api/analytics/stats`, {
                headers: { 'Authorization': `Bearer ${pw}` }
            });

            if (res.status === 401) {
                authError.textContent = 'Wrong password.';
                authError.style.display = 'block';
            } else {
                // Success
                adminToken = pw;
                sessionStorage.setItem('wt_admin_token', pw);
                authGate.style.display = 'none';
                dashboard.style.display = 'block';
                const data = await res.json();
                renderDashboard(data);
            }
        } catch (err) {
            authError.textContent = 'Connection failed: ' + err.message;
            authError.style.display = 'block';
        }

        loginBtn.innerHTML = "<i class='bx bx-log-in'></i> Access";
        loginBtn.disabled = false;
    }

    refreshBtn.addEventListener('click', () => loadDashboardData(adminToken));

    async function loadDashboardData(token) {
        refreshBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Loading...";
        refreshBtn.disabled = true;

        try {
            const res = await fetch(`${getApiBase()}/api/analytics/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            renderDashboard(data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        }

        refreshBtn.innerHTML = "<i class='bx bx-refresh'></i> Refresh";
        refreshBtn.disabled = false;
    }

    function renderDashboard(data) {
        const lastUpdated = container.querySelector('#admin-last-updated');
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

        if (!data.configured) {
            notConfigured.style.display = 'block';
            // Show local stats as fallback
            const local = Analytics.getLocalStats();
            renderToolChart(local.toolViews, {});
            renderApiChart(local.apiCalls);
            return;
        }

        notConfigured.style.display = 'none';

        // Stat cards
        container.querySelector('#stat-total-visits').textContent = formatNumber(data.totalVisits || 0);
        container.querySelector('#stat-today-sessions').textContent = formatNumber(data.todayUniqueSessions || 0);
        container.querySelector('#stat-total-api').textContent = formatNumber(data.totalApiCalls || 0);
        container.querySelector('#stat-tools-count').textContent = Object.keys(data.toolViews || {}).length;

        // Daily visits chart
        renderDailyChart(data.dailyVisits || {});

        // Hourly chart
        renderHourlyChart(data.hourlyDistribution || {});

        // Tool usage
        renderToolChart(data.toolViews || {}, data.toolNames || {});

        // API calls
        renderApiChart(data.apiCalls || {});

        // Recent visitors
        renderRecentVisitors(data.recentVisitors || []);
    }

    function formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return n.toString();
    }

    function renderDailyChart(dailyVisits) {
        const chartEl = container.querySelector('#chart-daily-visits');
        const days = Object.keys(dailyVisits).sort();
        const values = days.map(d => dailyVisits[d] || 0);
        const max = Math.max(...values, 1);

        chartEl.innerHTML = days.map((day, i) => {
            const height = Math.max((values[i] / max) * 150, 4);
            const label = day.slice(5); // MM-DD
            const isToday = i === days.length - 1;
            return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
                    <span style="color: ${isToday ? '#818cf8' : 'var(--text-secondary)'}; font-size: 11px; font-weight: ${isToday ? '700' : '400'};">${values[i]}</span>
                    <div style="width: 100%; height: ${height}px; background: ${isToday ? 'linear-gradient(180deg, #818cf8, #6366f1)' : 'rgba(99,102,241,0.3)'}; border-radius: 4px 4px 0 0; transition: height 0.5s ease;"></div>
                    <span style="color: var(--text-secondary); font-size: 10px;">${label}</span>
                </div>
            `;
        }).join('');
    }

    function renderHourlyChart(hourly) {
        const chartEl = container.querySelector('#chart-hourly');
        const values = [];
        for (let h = 0; h < 24; h++) values.push(hourly[h.toString()] || 0);
        const max = Math.max(...values, 1);

        chartEl.innerHTML = values.map((v, h) => {
            const height = Math.max((v / max) * 150, 2);
            const isNow = h === new Date().getHours();
            return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 2px;" title="${h}:00 — ${v} visits">
                    <div style="width: 100%; height: ${height}px; background: ${isNow ? '#34d399' : 'rgba(16,185,129,0.3)'}; border-radius: 2px 2px 0 0; transition: height 0.5s ease;"></div>
                </div>
            `;
        }).join('');
    }

    function renderToolChart(toolViews, toolNames) {
        const chartEl = container.querySelector('#chart-tool-views');
        const entries = Object.entries(toolViews).sort((a, b) => b[1] - a[1]);
        const max = entries.length > 0 ? entries[0][1] : 1;

        if (entries.length === 0) {
            chartEl.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 24px;">No data yet</p>';
            return;
        }

        const colors = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#06b6d4', '#a78bfa', '#fb923c', '#38bdf8'];

        chartEl.innerHTML = entries.map(([id, count], i) => {
            const width = Math.max((count / max) * 100, 8);
            const name = toolNames[id] || id;
            const color = colors[i % colors.length];
            return `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 120px; font-size: 13px; color: var(--text-secondary); text-align: right; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${name}">${name}</div>
                    <div style="flex: 1; height: 26px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden; position: relative;">
                        <div style="height: 100%; width: ${width}%; background: ${color}; border-radius: 6px; transition: width 0.8s ease; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px;">
                            <span style="color: #fff; font-size: 11px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${count}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderApiChart(apiCalls) {
        const chartEl = container.querySelector('#chart-api-calls');
        const entries = Object.entries(apiCalls).sort((a, b) => b[1] - a[1]);
        const max = entries.length > 0 ? entries[0][1] : 1;

        if (entries.length === 0) {
            chartEl.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 24px;">No data yet</p>';
            return;
        }

        const colors = ['#f472b6', '#fb923c', '#34d399', '#818cf8', '#fbbf24', '#06b6d4'];

        chartEl.innerHTML = entries.map(([endpoint, count], i) => {
            const width = Math.max((count / max) * 100, 8);
            const short = endpoint.replace('/api/ai/', '').replace('/api/', '');
            const color = colors[i % colors.length];
            return `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 120px; font-size: 13px; color: var(--text-secondary); text-align: right; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace;" title="${endpoint}">${short}</div>
                    <div style="flex: 1; height: 26px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden;">
                        <div style="height: 100%; width: ${width}%; background: ${color}; border-radius: 6px; transition: width 0.8s ease; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px;">
                            <span style="color: #fff; font-size: 11px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${count}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderRecentVisitors(visitors) {
        const tbody = container.querySelector('#visitors-tbody');
        if (visitors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-secondary);">No visitors recorded yet</td></tr>';
            return;
        }

        function parseUA(ua) {
            if (!ua) return 'Unknown';
            if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
            if (ua.includes('Edg')) return 'Edge';
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
            return 'Other';
        }

        tbody.innerHTML = visitors.map(v => {
            const time = v.timestamp ? new Date(v.timestamp).toLocaleString() : '--';
            const screen = v.screenWidth ? `${v.screenWidth}×${v.screenHeight}` : '--';
            const lang = v.language || '--';
            const ref = v.referrer || 'direct';
            const browser = parseUA(v.userAgent);
            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <td style="padding: 10px 12px; color: #fff;">${time}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">${screen}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">${lang}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ref}">${ref === 'direct' ? '🔗 Direct' : ref}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">${browser}</td>
                </tr>
            `;
        }).join('');
    }
}
