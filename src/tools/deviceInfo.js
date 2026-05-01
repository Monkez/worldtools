export function renderDeviceInfo(container) {
    const ua = navigator.userAgent;
    const screenW = window.screen.width;
    const screenH = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const platform = navigator.platform;
    const maxTouchPoints = navigator.maxTouchPoints;
    const hardwareConcurrency = navigator.hardwareConcurrency || 'Unknown';
    const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown';
    const language = navigator.language;
    const online = navigator.onLine ? '<span style="color: #4ade80;">Online</span>' : '<span style="color: #ef4444;">Offline</span>';
    
    let connectionType = 'Unknown';
    if (navigator.connection) {
        connectionType = `${navigator.connection.effectiveType || 'unknown'} (Downlink: ${navigator.connection.downlink || 0} Mbps)`;
    }

    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bx-info-circle'></i> Device Info & Status</h2>
            <p>Detailed information about your current browser, operating system, and hardware capabilities.</p>
        </div>
        <div class="panel">
            <h3 style="margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Browser & OS</h3>
            <div style="display: grid; grid-template-columns: 150px 1fr; gap: 12px; margin-bottom: 32px;">
                <div style="color: var(--text-secondary); font-size: 14px;">User Agent</div>
                <div style="font-family: monospace; font-size: 13px; word-break: break-all; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">${ua}</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Platform</div>
                <div style="font-weight: 500;">${platform}</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Language</div>
                <div style="font-weight: 500;">${language}</div>
            </div>

            <h3 style="margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Hardware & Display</h3>
            <div style="display: grid; grid-template-columns: 150px 1fr; gap: 12px; margin-bottom: 32px;">
                <div style="color: var(--text-secondary); font-size: 14px;">Screen Resolution</div>
                <div style="font-weight: 500;">${screenW} x ${screenH}</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Color Depth</div>
                <div style="font-weight: 500;">${colorDepth}-bit</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Logical Cores (CPU)</div>
                <div style="font-weight: 500;">${hardwareConcurrency}</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Device Memory (RAM)</div>
                <div style="font-weight: 500;">~${deviceMemory}</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Touch Support</div>
                <div style="font-weight: 500;">${maxTouchPoints > 0 ? `Yes (${maxTouchPoints} touch points)` : 'No'}</div>
            </div>

            <h3 style="margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Network Status</h3>
            <div style="display: grid; grid-template-columns: 150px 1fr; gap: 12px;">
                <div style="color: var(--text-secondary); font-size: 14px;">Status</div>
                <div style="font-weight: 500; font-size: 16px;">${online}</div>
                
                <div style="color: var(--text-secondary); font-size: 14px;">Connection</div>
                <div style="font-weight: 500;">${connectionType}</div>
            </div>
        </div>
    `;
}
