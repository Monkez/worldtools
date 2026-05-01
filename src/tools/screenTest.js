export function renderScreenTest(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2><i class='bx bx-desktop'></i> Screen Test</h2>
            <p>Check your monitor for dead pixels, backlight bleeding, and color accuracy.</p>
        </div>
        <div class="panel">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <button class="btn-primary" id="st-red" style="background: #ff0000; color: white;">Red</button>
                <button class="btn-primary" id="st-green" style="background: #00ff00; color: black;">Green</button>
                <button class="btn-primary" id="st-blue" style="background: #0000ff; color: white;">Blue</button>
                <button class="btn-primary" id="st-white" style="background: #ffffff; color: black;">White</button>
                <button class="btn-primary" id="st-black" style="background: #000000; border: 1px solid #333; color: white;">Black</button>
            </div>
            <div style="text-align: center; color: var(--text-secondary); font-size: 14px;">
                <p>Click any color to enter Fullscreen mode.</p>
                <p>Once in Fullscreen, click the screen to cycle colors or press <b>Esc</b> to exit.</p>
            </div>
        </div>

        <div id="st-fullscreen" style="display: none; position: fixed; inset: 0; z-index: 99999; cursor: pointer;"></div>
    `;

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];
    let currentColorIndex = 0;
    const fullscreenDiv = container.querySelector('#st-fullscreen');

    const enterFullscreen = (color) => {
        currentColorIndex = colors.indexOf(color);
        fullscreenDiv.style.backgroundColor = color;
        fullscreenDiv.style.display = 'block';
        if (fullscreenDiv.requestFullscreen) {
            fullscreenDiv.requestFullscreen().catch(err => {
                console.warn("Fullscreen request failed:", err);
            });
        }
    };

    const cycleColor = () => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        fullscreenDiv.style.backgroundColor = colors[currentColorIndex];
    };

    const exitFullscreen = () => {
        fullscreenDiv.style.display = 'none';
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    container.querySelector('#st-red').addEventListener('click', () => enterFullscreen('#ff0000'));
    container.querySelector('#st-green').addEventListener('click', () => enterFullscreen('#00ff00'));
    container.querySelector('#st-blue').addEventListener('click', () => enterFullscreen('#0000ff'));
    container.querySelector('#st-white').addEventListener('click', () => enterFullscreen('#ffffff'));
    container.querySelector('#st-black').addEventListener('click', () => enterFullscreen('#000000'));

    fullscreenDiv.addEventListener('click', cycleColor);
    
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenDiv.style.display = 'none';
        }
    });
}
