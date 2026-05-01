export function renderKeyboardTest(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bx-keyboard'></i> Keyboard & Keycode Tester</h2>
            <p>Press any key to test if it works, or view detailed KeyCode properties.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px; height: calc(100vh - 160px);">
            <!-- Visual Keyboard Area -->
            <div class="panel" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.2);">
                <div id="kt-key-display" style="font-size: 80px; font-weight: bold; color: var(--accent-color); height: 120px; text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);">
                    Press any key
                </div>
                <div style="display: flex; gap: 40px; margin-top: 20px;">
                    <div style="text-align: center;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">event.key</div>
                        <div id="kt-key-val" style="font-size: 24px; font-family: monospace; margin-top: 8px;">-</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">event.code</div>
                        <div id="kt-code-val" style="font-size: 24px; font-family: monospace; margin-top: 8px;">-</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">event.keyCode</div>
                        <div id="kt-keycode-val" style="font-size: 24px; font-family: monospace; margin-top: 8px;">-</div>
                    </div>
                </div>
                
                <div style="margin-top: 60px; display: flex; gap: 8px;">
                    <div id="kt-mod-ctrl" class="kt-modifier">Ctrl</div>
                    <div id="kt-mod-alt" class="kt-modifier">Alt</div>
                    <div id="kt-mod-shift" class="kt-modifier">Shift</div>
                    <div id="kt-mod-meta" class="kt-modifier">Meta</div>
                </div>
            </div>

            <!-- History Panel -->
            <div class="panel" style="display: flex; flex-direction: column;">
                <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Keypress History</h3>
                <div id="kt-history" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
                    <div style="color: var(--text-secondary); font-size: 13px; text-align: center; margin-top: 20px;">No keys pressed yet.</div>
                </div>
                <button class="btn-secondary" id="kt-clear" style="margin-top: 16px; width: 100%;"><i class='bx bx-trash'></i> Clear History</button>
            </div>
        </div>

        <style>
            .kt-modifier {
                padding: 8px 16px;
                border-radius: 6px;
                border: 2px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.5);
                font-weight: bold;
                transition: all 0.1s;
            }
            .kt-modifier.active {
                background: var(--accent-color);
                border-color: var(--accent-color);
                color: #fff;
                box-shadow: 0 0 10px var(--accent-color);
            }
            .kt-history-item {
                display: flex;
                justify-content: space-between;
                background: rgba(255,255,255,0.05);
                padding: 8px 12px;
                border-radius: 4px;
                font-family: monospace;
                animation: slideIn 0.2s ease-out;
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(10px); }
                to { opacity: 1; transform: translateX(0); }
            }
        </style>
    `;

    const display = container.querySelector('#kt-key-display');
    const keyVal = container.querySelector('#kt-key-val');
    const codeVal = container.querySelector('#kt-code-val');
    const keycodeVal = container.querySelector('#kt-keycode-val');
    const historyContainer = container.querySelector('#kt-history');
    
    const modCtrl = container.querySelector('#kt-mod-ctrl');
    const modAlt = container.querySelector('#kt-mod-alt');
    const modShift = container.querySelector('#kt-mod-shift');
    const modMeta = container.querySelector('#kt-mod-meta');

    let historyCount = 0;

    const handleKeyDown = (e) => {
        // Prevent default browser actions for some hotkeys (like F5, Ctrl+S)
        // Except for F12 (DevTools)
        if (e.key !== 'F12') {
            e.preventDefault();
            e.stopPropagation();
        }

        const k = e.key === ' ' ? 'Space' : e.key;
        
        display.innerText = k;
        display.style.transform = 'scale(0.95)';
        setTimeout(() => display.style.transform = 'scale(1)', 50);

        keyVal.innerText = k;
        codeVal.innerText = e.code;
        keycodeVal.innerText = e.keyCode;

        modCtrl.classList.toggle('active', e.ctrlKey);
        modAlt.classList.toggle('active', e.altKey);
        modShift.classList.toggle('active', e.shiftKey);
        modMeta.classList.toggle('active', e.metaKey);

        if (historyCount === 0) historyContainer.innerHTML = '';
        
        const item = document.createElement('div');
        item.className = 'kt-history-item';
        item.innerHTML = `<span><b style="color:var(--accent-color)">${k}</b></span><span style="color:var(--text-secondary)">${e.code} (${e.keyCode})</span>`;
        historyContainer.prepend(item);
        
        historyCount++;
        if (historyCount > 50) {
            historyContainer.removeChild(historyContainer.lastChild);
        }
    };

    const handleKeyUp = (e) => {
        modCtrl.classList.toggle('active', e.ctrlKey);
        modAlt.classList.toggle('active', e.altKey);
        modShift.classList.toggle('active', e.shiftKey);
        modMeta.classList.toggle('active', e.metaKey);
    };

    // Attach to document, but we must remove it when leaving tool
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp);

    container.querySelector('#kt-clear').addEventListener('click', () => {
        historyContainer.innerHTML = '<div style="color: var(--text-secondary); font-size: 13px; text-align: center; margin-top: 20px;">No keys pressed yet.</div>';
        historyCount = 0;
    });

    // Cleanup hook logic via MutationObserver (if tool unmounts)
    const observer = new MutationObserver((mutations) => {
        if (!document.body.contains(container)) {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
