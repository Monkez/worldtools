export function renderBatteryTest(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bx-battery'></i> Battery Status</h2>
            <p>Check the current battery level and charging status of your device.</p>
        </div>
        <div class="panel" id="bt-panel">
            <div style="text-align: center; padding: 40px;">
                <i class='bx bx-loader-alt bx-spin' style="font-size: 48px; color: var(--accent-color);"></i>
                <p style="margin-top: 16px; color: var(--text-secondary);">Requesting Battery Info...</p>
            </div>
        </div>
    `;

    const panel = container.querySelector('#bt-panel');

    const formatTime = (seconds) => {
        if (!seconds || seconds === Infinity) return "Unknown";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h} hours ${m} minutes`;
        return `${m} minutes`;
    };

    const updateBatteryUI = (battery) => {
        const level = Math.round(battery.level * 100);
        let icon = 'bx-battery';
        let color = '#4ade80'; // green
        
        if (level <= 20) {
            color = '#ef4444'; // red
            icon = 'bx-battery-0'; // wait, boxicons don't have battery-0. Let's just use bx-battery
        } else if (level <= 50) {
            color = '#f59e0b'; // yellow
        }

        if (battery.charging) {
            color = '#3b82f6'; // blue
        }

        panel.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 40px;">
                <div style="position: relative; width: 120px; height: 60px; border: 4px solid #fff; border-radius: 8px; padding: 4px;">
                    <div style="position: absolute; right: -10px; top: 16px; width: 6px; height: 20px; background: #fff; border-radius: 0 4px 4px 0;"></div>
                    <div style="width: ${level}%; height: 100%; background: ${color}; border-radius: 4px; transition: width 0.5s;"></div>
                    ${battery.charging ? `<i class='bx bxs-zap' style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 32px; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5);"></i>` : ''}
                </div>
                <div style="text-align: left;">
                    <h1 style="margin: 0; font-size: 48px; color: ${color};">${level}%</h1>
                    <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 16px;">
                        ${battery.charging ? 'Plugged in, charging' : 'On battery power'}
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">Time to fully charge</p>
                    <h3 style="margin: 0; font-size: 18px;">${battery.charging ? formatTime(battery.chargingTime) : 'N/A'}</h3>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: var(--text-secondary); text-transform: uppercase;">Time remaining</p>
                    <h3 style="margin: 0; font-size: 18px;">${!battery.charging ? formatTime(battery.dischargingTime) : 'N/A'}</h3>
                </div>
            </div>
        `;
    };

    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryUI(battery);
            
            battery.addEventListener('levelchange', () => updateBatteryUI(battery));
            battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
            battery.addEventListener('chargingtimechange', () => updateBatteryUI(battery));
            battery.addEventListener('dischargingtimechange', () => updateBatteryUI(battery));
        }).catch(err => {
            panel.innerHTML = `<p style="color: #ef4444;"><i class='bx bx-error'></i> Error accessing battery API: ${err.message}</p>`;
        });
    } else {
        panel.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class='bx bx-error-circle' style="font-size: 48px; color: #f59e0b;"></i>
                <h3 style="margin-top: 16px;">Battery API Not Supported</h3>
                <p style="color: var(--text-secondary); margin-top: 8px;">Your browser does not support reading battery information.</p>
            </div>
        `;
    }
}
