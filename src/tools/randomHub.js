export function renderRandomHub(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1000px; margin: 0 auto; padding: 0;">
            <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;">
                <button id="tab-wheel" class="hub-tab active" style="flex: 1; background: none; border: none; padding: 16px; color: var(--accent-color); font-weight: 600; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid var(--accent-color); font-size: 15px;"><i class='bx bx-pie-chart-alt-2'></i> Wheel of Names</button>
                <button id="tab-numbers" class="hub-tab" style="flex: 1; background: none; border: none; padding: 16px; color: var(--text-secondary); font-weight: 500; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid transparent; font-size: 15px;"><i class='bx bx-dice-5'></i> Numbers & Lists</button>
                <button id="tab-pass" class="hub-tab" style="flex: 1; background: none; border: none; padding: 16px; color: var(--text-secondary); font-weight: 500; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid transparent; font-size: 15px;"><i class='bx bx-key'></i> Passwords & UUIDs</button>
            </div>

            <div style="padding: 24px;">
                
                <!-- WHEEL OF NAMES -->
                <div id="section-wheel" style="display: flex; gap: 24px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 12px;">Entries</h3>
                        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 12px;">Enter names/items (one per line):</p>
                        <textarea id="wheel-input" class="input-field" style="height: 300px; resize: none; font-family: monospace;">Alice
Bob
Charlie
David
Eve
Frank
Grace</textarea>
                        <div style="display: flex; gap: 12px; margin-top: 12px;">
                            <button id="btn-shuffle-wheel" class="btn-secondary" style="flex: 1;"><i class='bx bx-shuffle'></i> Shuffle</button>
                            <button id="btn-clear-wheel" class="btn-secondary" style="flex: 1;"><i class='bx bx-trash'></i> Clear</button>
                        </div>
                    </div>
                    
                    <div style="flex: 1.5; min-width: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 24px; position: relative;">
                        <canvas id="wheel-canvas" width="350" height="350" style="max-width: 100%; border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"></canvas>
                        <button id="btn-spin" class="btn-primary" style="margin-top: 32px; width: 200px; height: 50px; font-size: 18px; border-radius: 25px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);"><i class='bx bx-play-circle'></i> SPIN!</button>
                    </div>
                </div>

                <!-- NUMBERS & LISTS -->
                <div id="section-numbers" style="display: none; gap: 24px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 12px;">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 16px;"><i class='bx bx-dice-5' style="color: #10b981;"></i> Random Number</h3>
                        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                            <div class="form-group" style="flex: 1;">
                                <label>Min</label>
                                <input type="number" id="num-min" class="input-field" value="1">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>Max</label>
                                <input type="number" id="num-max" class="input-field" value="100">
                            </div>
                        </div>
                        <button id="btn-gen-num" class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #10b981, #059669);"><i class='bx bx-refresh'></i> Generate Number</button>
                        
                        <div id="num-result" style="margin-top: 24px; font-size: 64px; font-weight: bold; text-align: center; color: #10b981; text-shadow: 0 4px 10px rgba(16,185,129,0.3); font-family: monospace;">-</div>
                    </div>

                    <div style="flex: 1; min-width: 300px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 12px;">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 16px;"><i class='bx bx-list-ul' style="color: #f59e0b;"></i> List Shuffler & Picker</h3>
                        <textarea id="list-input" class="input-field" style="height: 120px; resize: none; margin-bottom: 16px;" placeholder="Paste your list here..."></textarea>
                        <div style="display: flex; gap: 12px;">
                            <button id="btn-shuffle-list" class="btn-primary" style="flex: 1; background: linear-gradient(135deg, #f59e0b, #d97706);"><i class='bx bx-shuffle'></i> Shuffle List</button>
                            <button id="btn-pick-list" class="btn-secondary" style="flex: 1;"><i class='bx bx-target-lock'></i> Pick 1 Random</button>
                        </div>
                    </div>
                </div>

                <!-- PASSWORDS & UUIDS -->
                <div id="section-pass" style="display: none; gap: 24px; flex-wrap: wrap;">
                    <!-- Password Generator -->
                    <div style="flex: 1; min-width: 300px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 12px;">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 24px;"><i class='bx bx-key' style="color: #ec4899;"></i> Password Generator</h3>
                        
                        <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
                            <span id="pass-result" style="font-family: monospace; font-size: 20px; color: #fff; word-break: break-all;">Click generate...</span>
                            <button id="btn-copy-pass" class="icon-btn" title="Copy"><i class='bx bx-copy'></i></button>
                        </div>

                        <div class="form-group">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Password Length</span>
                                <span id="pass-len-val" style="color: #ec4899; font-weight: bold;">16</span>
                            </label>
                            <input type="range" id="pass-len" min="4" max="64" value="16" style="width: 100%; margin-top: 8px; cursor: pointer;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; margin-top: 24px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                                <input type="checkbox" id="pass-upper" checked> Uppercase (A-Z)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                                <input type="checkbox" id="pass-lower" checked> Lowercase (a-z)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                                <input type="checkbox" id="pass-num" checked> Numbers (0-9)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                                <input type="checkbox" id="pass-sym" checked> Symbols (!@#$)
                            </label>
                        </div>

                        <button id="btn-gen-pass" class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #ec4899, #be185d);"><i class='bx bx-refresh'></i> Generate Password</button>
                    </div>

                    <!-- UUID Generator -->
                    <div style="flex: 1; min-width: 300px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 12px;">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 24px;"><i class='bx bx-barcode' style="color: #3b82f6;"></i> UUID v4 Generator</h3>
                        
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" id="uuid-qty" class="input-field" value="1" min="1" max="500">
                        </div>

                        <button id="btn-gen-uuid" class="btn-primary" style="width: 100%; margin-bottom: 24px; background: linear-gradient(135deg, #3b82f6, #1d4ed8);"><i class='bx bx-refresh'></i> Generate UUIDs</button>
                        
                        <div style="position: relative;">
                            <textarea id="uuid-result" class="input-field" style="height: 200px; resize: none; font-family: monospace;" readonly placeholder="UUIDs will appear here..."></textarea>
                            <button id="btn-copy-uuid" class="btn-secondary" style="position: absolute; right: 12px; top: 12px; padding: 6px 12px; font-size: 13px;"><i class='bx bx-copy'></i> Copy</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Tab Logic
    const tabs = ['wheel', 'numbers', 'pass'];
    tabs.forEach(tab => {
        const btn = container.querySelector('#tab-' + tab);
        btn.addEventListener('click', () => {
            // reset all
            tabs.forEach(t => {
                const b = container.querySelector('#tab-' + t);
                const s = container.querySelector('#section-' + t);
                b.style.color = 'var(--text-secondary)';
                b.style.borderBottomColor = 'transparent';
                b.style.fontWeight = '500';
                s.style.display = 'none';
            });
            // activate clicked
            btn.style.color = 'var(--accent-color)';
            btn.style.borderBottomColor = 'var(--accent-color)';
            btn.style.fontWeight = '600';
            container.querySelector('#section-' + tab).style.display = 'flex';
            
            if (tab === 'wheel') drawWheel();
        });
    });

    // ==========================================
    // WHEEL OF NAMES LOGIC
    // ==========================================
    const wheelInput = container.querySelector('#wheel-input');
    const canvas = container.querySelector('#wheel-canvas');
    const btnSpin = container.querySelector('#btn-spin');
    const btnShuffleWheel = container.querySelector('#btn-shuffle-wheel');
    const btnClearWheel = container.querySelector('#btn-clear-wheel');
    
    // High DPI Canvas Setup
    const dpr = window.devicePixelRatio || 1;
    const baseSize = 350;
    canvas.width = baseSize * dpr;
    canvas.height = baseSize * dpr;
    canvas.style.width = `${baseSize}px`;
    canvas.style.height = `${baseSize}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let currentRotation = 0;
    let isSpinning = false;
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#14b8a6', '#84cc16'];

    const getNames = () => wheelInput.value.split('\n').filter(x => x.trim() !== '');

    const drawWheel = () => {
        const names = getNames();
        const width = baseSize;
        const height = baseSize;
        const radius = Math.min(width, height) / 2 - 10;
        const cx = width / 2;
        const cy = height / 2;
        
        ctx.clearRect(0, 0, width, height);
        
        if(names.length === 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#374151';
            ctx.fill();
            ctx.fillStyle = '#9ca3af';
            ctx.textAlign = 'center';
            ctx.font = '16px Outfit';
            ctx.fillText('No names', cx, cy);
            return;
        }
        
        const sliceAngle = (2 * Math.PI) / names.length;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentRotation);
        
        for (let i = 0; i < names.length; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw text
            ctx.save();
            ctx.rotate(i * sliceAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            const text = names[i].length > 18 ? names[i].substring(0, 15) + '...' : names[i];
            ctx.fillText(text, radius - 20, 0);
            ctx.restore();
        }
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.15, 0, 2 * Math.PI);
        ctx.fillStyle = '#1f2937';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.restore();
        
        // Draw Pointer (right side)
        ctx.beginPath();
        ctx.moveTo(width, cy - 15);
        ctx.lineTo(width, cy + 15);
        ctx.lineTo(width - 35, cy);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fill();
    };

    wheelInput.addEventListener('input', drawWheel);
    
    btnShuffleWheel.addEventListener('click', () => {
        let names = getNames();
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }
        wheelInput.value = names.join('\n');
        drawWheel();
    });
    
    btnClearWheel.addEventListener('click', () => {
        wheelInput.value = '';
        drawWheel();
    });

    btnSpin.addEventListener('click', () => {
        const names = getNames();
        if(names.length === 0 || isSpinning) return;
        isSpinning = true;
        
        const startRotation = currentRotation;
        const distance = (Math.PI * 2 * 10) + (Math.random() * Math.PI * 2); // 10 spins + random
        const duration = 5000; // 5 seconds
        const start = performance.now();
        
        btnSpin.disabled = true;
        btnSpin.style.opacity = '0.5';

        const animate = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            currentRotation = startRotation + distance * easeOut;
            drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                btnSpin.disabled = false;
                btnSpin.style.opacity = '1';
                
                // Determine winner
                const sliceAngle = (2 * Math.PI) / names.length;
                let normalizedRotation = currentRotation % (2 * Math.PI);
                let pointerAngle = (2 * Math.PI) - normalizedRotation;
                let index = Math.floor(pointerAngle / sliceAngle);
                
                setTimeout(() => alert("Winner: " + names[index]), 100);
            }
        };
        requestAnimationFrame(animate);
    });

    // Initial draw
    requestAnimationFrame(drawWheel);


    // ==========================================
    // NUMBERS & LISTS LOGIC
    // ==========================================
    const numMin = container.querySelector('#num-min');
    const numMax = container.querySelector('#num-max');
    const btnGenNum = container.querySelector('#btn-gen-num');
    const numResult = container.querySelector('#num-result');

    btnGenNum.addEventListener('click', () => {
        const min = parseInt(numMin.value);
        const max = parseInt(numMax.value);
        if (min >= max) {
            alert('Max must be greater than Min!');
            return;
        }
        // Rapid animation effect
        let ticks = 0;
        const interval = setInterval(() => {
            numResult.innerText = Math.floor(Math.random() * (max - min + 1)) + min;
            ticks++;
            if(ticks > 15) clearInterval(interval);
        }, 30);
    });

    const listInput = container.querySelector('#list-input');
    const btnShuffleList = container.querySelector('#btn-shuffle-list');
    const btnPickList = container.querySelector('#btn-pick-list');

    btnShuffleList.addEventListener('click', () => {
        let items = listInput.value.split('\n').filter(x => x.trim() !== '');
        if(items.length < 2) return;
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        listInput.value = items.join('\n');
    });

    btnPickList.addEventListener('click', () => {
        let items = listInput.value.split('\n').filter(x => x.trim() !== '');
        if(items.length === 0) return;
        const picked = items[Math.floor(Math.random() * items.length)];
        alert("Picked: " + picked);
    });

    // ==========================================
    // PASSWORD & UUID LOGIC
    // ==========================================
    const passLenSlider = container.querySelector('#pass-len');
    const passLenVal = container.querySelector('#pass-len-val');
    const cbUpper = container.querySelector('#pass-upper');
    const cbLower = container.querySelector('#pass-lower');
    const cbNum = container.querySelector('#pass-num');
    const cbSym = container.querySelector('#pass-sym');
    const btnGenPass = container.querySelector('#btn-gen-pass');
    const passResult = container.querySelector('#pass-result');
    const btnCopyPass = container.querySelector('#btn-copy-pass');

    passLenSlider.addEventListener('input', (e) => {
        passLenVal.innerText = e.target.value;
    });

    btnGenPass.addEventListener('click', () => {
        const length = parseInt(passLenSlider.value);
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let charset = "";
        if (cbUpper.checked) charset += upper;
        if (cbLower.checked) charset += lower;
        if (cbNum.checked) charset += numbers;
        if (cbSym.checked) charset += symbols;

        if (charset === "") {
            passResult.innerText = "Select at least one option!";
            return;
        }

        let password = "";
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        passResult.innerText = password;
        passResult.style.color = '#10b981'; // green flash
        setTimeout(() => passResult.style.color = '#fff', 300);
    });

    btnCopyPass.addEventListener('click', () => {
        if(passResult.innerText !== "Click generate...") {
            navigator.clipboard.writeText(passResult.innerText);
            btnCopyPass.innerHTML = "<i class='bx bx-check'></i>";
            setTimeout(() => btnCopyPass.innerHTML = "<i class='bx bx-copy'></i>", 1000);
        }
    });

    const uuidQty = container.querySelector('#uuid-qty');
    const btnGenUuid = container.querySelector('#btn-gen-uuid');
    const uuidResult = container.querySelector('#uuid-result');
    const btnCopyUuid = container.querySelector('#btn-copy-uuid');

    btnGenUuid.addEventListener('click', () => {
        const qty = parseInt(uuidQty.value) || 1;
        let result = [];
        for (let i = 0; i < qty; i++) {
            result.push(crypto.randomUUID());
        }
        uuidResult.value = result.join('\n');
    });

    btnCopyUuid.addEventListener('click', () => {
        if(uuidResult.value) {
            navigator.clipboard.writeText(uuidResult.value);
            btnCopyUuid.innerHTML = "<i class='bx bx-check'></i> Copied!";
            setTimeout(() => btnCopyUuid.innerHTML = "<i class='bx bx-copy'></i> Copy", 1500);
        }
    });
}
