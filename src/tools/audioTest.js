export function renderAudioTest(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bx-headphone'></i> Audio & Stereo Test</h2>
            <p>Check your speakers or headphones for Left/Right channel separation and frequency response.</p>
        </div>
        <div class="panel">
            <h3 style="margin-top: 0; margin-bottom: 16px;">Channel Test</h3>
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                <button class="btn-primary" id="at-left" style="flex: 1;"><i class='bx bx-left-arrow-alt'></i> Play Left Channel</button>
                <button class="btn-primary" id="at-right" style="flex: 1;">Play Right Channel <i class='bx bx-right-arrow-alt'></i></button>
                <button class="btn-secondary" id="at-both" style="flex: 1;">Play Both</button>
            </div>
            
            <h3 style="margin-bottom: 16px;">Frequency Sweep (20Hz - 20kHz)</h3>
            <div style="display: flex; gap: 16px; align-items: center;">
                <button class="btn-primary" id="at-sweep"><i class='bx bx-play'></i> Start Sweep</button>
                <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: hidden;">
                    <div id="at-sweep-progress" style="position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: var(--accent-color); transition: width 0.1s linear;"></div>
                </div>
                <span id="at-freq-val" style="font-family: monospace; min-width: 60px; text-align: right;">0 Hz</span>
            </div>
        </div>
    `;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playTone = (panValue) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const panner = audioCtx.createStereoPanner();
        
        osc.type = 'sine';
        osc.frequency.value = 440; // A4
        
        panner.pan.value = panValue;
        
        // Envelope to avoid clicking
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime + 1.5);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.6);
        
        osc.connect(panner);
        panner.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 1.6);
    };

    container.querySelector('#at-left').addEventListener('click', () => playTone(-1));
    container.querySelector('#at-right').addEventListener('click', () => playTone(1));
    container.querySelector('#at-both').addEventListener('click', () => playTone(0));

    // Sweep logic
    let sweepOsc = null;
    let sweepGain = null;
    let sweepInterval = null;

    const startSweep = () => {
        const btn = container.querySelector('#at-sweep');
        const freqVal = container.querySelector('#at-freq-val');
        const progress = container.querySelector('#at-sweep-progress');
        
        if (sweepOsc) {
            // Stop it
            sweepOsc.stop();
            sweepOsc.disconnect();
            sweepGain.disconnect();
            sweepOsc = null;
            clearInterval(sweepInterval);
            btn.innerHTML = "<i class='bx bx-play'></i> Start Sweep";
            freqVal.innerText = "0 Hz";
            progress.style.width = "0%";
            return;
        }

        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        btn.innerHTML = "<i class='bx bx-stop'></i> Stop Sweep";
        
        sweepOsc = audioCtx.createOscillator();
        sweepGain = audioCtx.createGain();
        
        sweepOsc.type = 'sine';
        const duration = 10; // seconds
        const minFreq = 20;
        const maxFreq = 20000;
        
        sweepOsc.frequency.setValueAtTime(minFreq, audioCtx.currentTime);
        sweepOsc.frequency.exponentialRampToValueAtTime(maxFreq, audioCtx.currentTime + duration);
        
        sweepGain.gain.setValueAtTime(0, audioCtx.currentTime);
        sweepGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
        sweepGain.gain.setValueAtTime(0.3, audioCtx.currentTime + duration - 0.1);
        sweepGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
        
        sweepOsc.connect(sweepGain);
        sweepGain.connect(audioCtx.destination);
        
        sweepOsc.start();
        sweepOsc.stop(audioCtx.currentTime + duration);
        
        const startTime = audioCtx.currentTime;
        
        sweepInterval = setInterval(() => {
            const elapsed = audioCtx.currentTime - startTime;
            if (elapsed >= duration) {
                clearInterval(sweepInterval);
                sweepOsc = null;
                btn.innerHTML = "<i class='bx bx-play'></i> Start Sweep";
                freqVal.innerText = "20000 Hz";
                progress.style.width = "100%";
                return;
            }
            
            // Calculate current frequency for display (exponential ramp formula)
            const currentFreq = minFreq * Math.pow(maxFreq / minFreq, elapsed / duration);
            freqVal.innerText = Math.round(currentFreq) + " Hz";
            progress.style.width = ((elapsed / duration) * 100) + "%";
        }, 50);
    };

    container.querySelector('#at-sweep').addEventListener('click', startSweep);
}
