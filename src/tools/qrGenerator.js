export function renderQrGenerator(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 600px; margin: 0 auto;">
            <div class="form-group">
                <label>Enter URL or Text to generate QR Code</label>
                <textarea id="qr-input" class="input-field" style="height: 100px; resize: vertical;" placeholder="https://google.com"></textarea>
            </div>
            
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Size (px)</label>
                    <input type="number" id="qr-size" class="input-field" value="250" min="100" max="1000">
                </div>
            </div>

            <button class="btn-primary" id="qr-generate" style="width: 100%; margin-bottom: 32px;">
                <i class='bx bx-qr-scan'></i> Generate QR Code
            </button>

            <div id="qr-result-container" style="display: none; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px;">
                <div style="background: white; padding: 16px; border-radius: 8px; display: inline-block; margin-bottom: 16px;">
                    <img id="qr-image" src="" alt="QR Code" style="display: block;">
                </div>
                <div>
                    <a id="qr-download" class="btn-secondary" style="display: inline-flex; text-decoration: none;" download="qrcode.png">
                        <i class='bx bx-download'></i> Download PNG
                    </a>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('#qr-input');
    const sizeInput = container.querySelector('#qr-size');
    const btnGen = container.querySelector('#qr-generate');
    const resultContainer = container.querySelector('#qr-result-container');
    const qrImage = container.querySelector('#qr-image');
    const btnDownload = container.querySelector('#qr-download');

    btnGen.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;

        const size = sizeInput.value || 250;
        
        // Using goqr.me API which is fast and reliable
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
        
        qrImage.onload = () => {
            resultContainer.style.display = 'block';
        };
        qrImage.src = url;
        btnDownload.href = url;
    });
}
