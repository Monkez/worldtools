export function renderBase64(container) {
    container.innerHTML = `
        <div class="panel" style="display: flex; flex-direction: column; gap: 24px;">
            <div style="display: flex; gap: 16px;">
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="color: var(--text-secondary); font-weight: 500;">Text / Input</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-secondary" id="b64-paste-text" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-paste'></i> Paste</button>
                            <button class="btn-secondary" id="b64-copy-text" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-copy'></i> Copy</button>
                        </div>
                    </div>
                    <textarea id="b64-text" class="input-field" style="height: 250px; resize: vertical; font-family: monospace;" placeholder="Enter plain text here..."></textarea>
                </div>
                
                <div style="display: flex; flex-direction: column; justify-content: center; gap: 16px;">
                    <button class="btn-primary" id="b64-encode" style="width: 120px;"><i class='bx bx-right-arrow-alt'></i> Encode</button>
                    <button class="btn-primary" id="b64-decode" style="width: 120px;"><i class='bx bx-left-arrow-alt'></i> Decode</button>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="color: var(--text-secondary); font-weight: 500;">Base64 Output</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-secondary" id="b64-paste-b64" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-paste'></i> Paste</button>
                            <button class="btn-secondary" id="b64-copy-b64" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-copy'></i> Copy</button>
                        </div>
                    </div>
                    <textarea id="b64-output" class="input-field" style="height: 250px; resize: vertical; font-family: monospace; background: rgba(0,0,0,0.4);" placeholder="Base64 encoded result..."></textarea>
                </div>
            </div>
        </div>
    `;

    const txtInput = container.querySelector('#b64-text');
    const b64Output = container.querySelector('#b64-output');
    
    container.querySelector('#b64-encode').addEventListener('click', () => {
        try {
            // Support unicode encoding
            const str = txtInput.value;
            b64Output.value = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode('0x' + p1);
            }));
        } catch (e) {
            b64Output.value = "Error encoding to Base64";
        }
    });

    container.querySelector('#b64-decode').addEventListener('click', () => {
        try {
            const str = b64Output.value;
            txtInput.value = decodeURIComponent(atob(str).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            txtInput.value = "Error decoding from Base64. Invalid format.";
        }
    });

    const setupClipboard = (copyBtnId, pasteBtnId, targetInputId) => {
        const copyBtn = container.querySelector('#' + copyBtnId);
        const pasteBtn = container.querySelector('#' + pasteBtnId);
        const input = container.querySelector('#' + targetInputId);

        copyBtn.addEventListener('click', () => {
            if (!input.value) return;
            navigator.clipboard.writeText(input.value);
            const ori = copyBtn.innerHTML;
            copyBtn.innerHTML = "<i class='bx bx-check'></i>";
            setTimeout(() => copyBtn.innerHTML = ori, 1000);
        });

        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                input.value = text;
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
            }
        });
    };

    setupClipboard('b64-copy-text', 'b64-paste-text', 'b64-text');
    setupClipboard('b64-copy-b64', 'b64-paste-b64', 'b64-output');
}
