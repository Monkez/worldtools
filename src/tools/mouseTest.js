export function renderMouseTest(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bx-mouse'></i> Mouse & Scroll Tester</h2>
            <p>Test mouse buttons, double-click issues, scroll speed, and polling rate.</p>
        </div>
        
        <div class="panel" style="display: flex; gap: 20px; height: calc(100vh - 160px);">
            <!-- Interactive Mouse Area -->
            <div id="mt-area" style="flex: 1; border: 2px dashed rgba(255,255,255,0.2); border-radius: 8px; position: relative; overflow: hidden; cursor: crosshair; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; user-select: none;">
                <canvas id="mt-canvas" style="position: absolute; inset: 0; pointer-events: none;"></canvas>
                <div style="text-align: center; pointer-events: none; z-index: 10;">
                    <h1 id="mt-btn-name" style="font-size: 48px; color: rgba(255,255,255,0.3); margin: 0; transition: color 0.1s;">Click Here</h1>
                    <p id="mt-scroll-val" style="color: var(--accent-color); font-size: 24px; font-weight: bold; margin-top: 16px; opacity: 0; transition: opacity 0.2s;">Scroll: 0px</p>
                </div>
            </div>

            <!-- Stats & Status Panel -->
            <div style="width: 300px; display: flex; flex-direction: column; gap: 20px;">
                <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Button Status</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div id="mt-ind-left" class="mt-indicator">Left (0)</div>
                        <div id="mt-ind-right" class="mt-indicator">Right (2)</div>
                        <div id="mt-ind-mid" class="mt-indicator" style="grid-column: span 2;">Middle (1)</div>
                        <div id="mt-ind-back" class="mt-indicator">Back (3)</div>
                        <div id="mt-ind-fwd" class="mt-indicator">Forward (4)</div>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Double Click Test</h3>
                    <div id="mt-dbl-box" style="background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 30px 10px; text-align: center; cursor: pointer; transition: all 0.2s; user-select: none;">
                        <span id="mt-dbl-text">Double Click Me</span>
                    </div>
                </div>
                
                <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; flex: 1;">
                    <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Coordinates</h3>
                    <div style="font-family: monospace; font-size: 20px;">
                        X: <span id="mt-x" style="color: var(--accent-color);">0</span><br>
                        Y: <span id="mt-y" style="color: var(--accent-color);">0</span>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .mt-indicator {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 4px;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                color: rgba(255,255,255,0.5);
                transition: all 0.1s;
            }
            .mt-indicator.active {
                background: var(--accent-color);
                color: #fff;
                border-color: var(--accent-color);
                box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
                transform: scale(0.95);
            }
            .mt-dbl-success {
                background: rgba(34, 197, 94, 0.2) !important;
                border-color: #22c55e !important;
                color: #22c55e;
            }
        </style>
    `;

    const area = container.querySelector('#mt-area');
    const canvas = container.querySelector('#mt-canvas');
    const ctx = canvas.getContext('2d');
    
    const btnName = container.querySelector('#mt-btn-name');
    const scrollVal = container.querySelector('#mt-scroll-val');
    
    const indLeft = container.querySelector('#mt-ind-left');
    const indMid = container.querySelector('#mt-ind-mid');
    const indRight = container.querySelector('#mt-ind-right');
    const indBack = container.querySelector('#mt-ind-back');
    const indFwd = container.querySelector('#mt-ind-fwd');
    
    const posX = container.querySelector('#mt-x');
    const posY = container.querySelector('#mt-y');
    
    const dblBox = container.querySelector('#mt-dbl-box');
    const dblText = container.querySelector('#mt-dbl-text');

    // Setup canvas
    let width = 0;
    let height = 0;
    const resizeCanvas = () => {
        const rect = area.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const buttonNames = ['Left Button', 'Middle Button', 'Right Button', 'Back Button', 'Forward Button'];
    const indicators = [indLeft, indMid, indRight, indBack, indFwd];

    let lastDrawX = -1;
    let lastDrawY = -1;

    // Fade out drawing over time
    const fadeInterval = setInterval(() => {
        if (!document.body.contains(container)) {
            clearInterval(fadeInterval);
            return;
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
    }, 50);

    area.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const btn = e.button;
        if (btn >= 0 && btn <= 4) {
            indicators[btn].classList.add('active');
            btnName.innerText = buttonNames[btn];
            btnName.style.color = '#fff';
        }
    });

    area.addEventListener('mouseup', (e) => {
        e.preventDefault();
        const btn = e.button;
        if (btn >= 0 && btn <= 4) {
            indicators[btn].classList.remove('active');
            btnName.style.color = 'rgba(255,255,255,0.3)';
        }
    });

    // Prevent context menu
    area.addEventListener('contextmenu', (e) => e.preventDefault());

    area.addEventListener('mousemove', (e) => {
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        posX.innerText = Math.round(x);
        posY.innerText = Math.round(y);

        // Draw trail
        if (lastDrawX !== -1 && lastDrawY !== -1) {
            ctx.beginPath();
            ctx.moveTo(lastDrawX, lastDrawY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        lastDrawX = x;
        lastDrawY = y;
    });

    area.addEventListener('mouseleave', () => {
        lastDrawX = -1;
        lastDrawY = -1;
        indicators.forEach(i => i.classList.remove('active'));
    });

    let scrollTimeout;
    area.addEventListener('wheel', (e) => {
        e.preventDefault();
        const dir = e.deltaY > 0 ? 'Down' : 'Up';
        const spd = Math.abs(e.deltaY);
        scrollVal.innerText = `Scroll ${dir}: ${Math.round(spd)}px`;
        scrollVal.style.opacity = '1';
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollVal.style.opacity = '0';
        }, 500);
    });

    // Double click tester
    let dblClickTimeout;
    dblBox.addEventListener('dblclick', (e) => {
        e.preventDefault();
        dblBox.classList.add('mt-dbl-success');
        dblText.innerText = 'Success! 0ms bounce';
        
        clearTimeout(dblClickTimeout);
        dblClickTimeout = setTimeout(() => {
            dblBox.classList.remove('mt-dbl-success');
            dblText.innerText = 'Double Click Me';
        }, 1500);
    });

    // Cleanup
    const observer = new MutationObserver((mutations) => {
        if (!document.body.contains(container)) {
            window.removeEventListener('resize', resizeCanvas);
            clearInterval(fadeInterval);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
