export function renderStopwatch(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 500px; margin: 0 auto; text-align: center;">
            <div id="sw-display" style="font-size: 64px; font-weight: 300; font-family: monospace; letter-spacing: 4px; margin-bottom: 32px; color: #fff;">
                00:00:00.<span style="font-size: 32px; color: var(--text-secondary);">00</span>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 32px;">
                <button class="btn-primary" id="sw-start" style="width: 120px;">Start</button>
                <button class="btn-secondary" id="sw-lap" style="width: 120px;" disabled>Lap</button>
                <button class="btn-secondary" id="sw-reset" style="width: 120px;">Reset</button>
            </div>
            
            <div class="laps-container" style="text-align: left; max-height: 250px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tbody id="sw-laps-list">
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const display = container.querySelector('#sw-display');
    const startBtn = container.querySelector('#sw-start');
    const lapBtn = container.querySelector('#sw-lap');
    const resetBtn = container.querySelector('#sw-reset');
    const lapsList = container.querySelector('#sw-laps-list');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let lapCount = 0;

    const formatTime = (time) => {
        const ms = Math.floor((time % 1000) / 10);
        const s = Math.floor((time / 1000) % 60);
        const m = Math.floor((time / (1000 * 60)) % 60);
        const h = Math.floor((time / (1000 * 60 * 60)) % 24);

        const pad = (num) => num.toString().padStart(2, '0');
        
        return {
            main: `${pad(h)}:${pad(m)}:${pad(s)}`,
            ms: pad(ms)
        };
    };

    const updateDisplay = () => {
        const formatted = formatTime(elapsedTime);
        display.innerHTML = `${formatted.main}.<span style="font-size: 32px; color: var(--text-secondary);">${formatted.ms}</span>`;
    };

    const toggleTimer = () => {
        if (isRunning) {
            clearInterval(timerInterval);
            startBtn.innerText = 'Resume';
            startBtn.style.background = '';
            lapBtn.disabled = true;
        } else {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                updateDisplay();
            }, 10);
            startBtn.innerHTML = "<i class='bx bx-pause'></i> Pause";
            startBtn.style.background = "#ef4444";
            lapBtn.disabled = false;
        }
        isRunning = !isRunning;
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        lapCount = 0;
        updateDisplay();
        startBtn.innerText = 'Start';
        startBtn.style.background = '';
        lapBtn.disabled = true;
        lapsList.innerHTML = '';
    };

    const addLap = () => {
        lapCount++;
        const formatted = formatTime(elapsedTime);
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        
        tr.innerHTML = `
            <td style="padding: 12px 8px; color: var(--text-secondary);">Lap ${lapCount}</td>
            <td style="padding: 12px 8px; text-align: right; font-family: monospace; font-size: 16px;">${formatted.main}.${formatted.ms}</td>
        `;
        
        lapsList.insertBefore(tr, lapsList.firstChild);
    };

    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', addLap);
}
