export function renderUrlEncoder(container) {
    container.innerHTML = `
        <div class="panel" style="display: flex; flex-direction: column; gap: 24px;">
            <div style="display: flex; gap: 16px;">
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="color: var(--text-secondary); font-weight: 500;">Text / Input</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-secondary" id="url-paste-in" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-paste'></i> Paste</button>
                            <button class="btn-secondary" id="url-clear" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-trash'></i> Clear</button>
                        </div>
                    </div>
                    <textarea id="url-input" class="input-field" style="height: 250px; resize: vertical; font-family: monospace;" placeholder="Enter plain text or URL here..."></textarea>
                </div>
                
                <div style="display: flex; flex-direction: column; justify-content: center; gap: 16px;">
                    <button class="btn-primary" id="url-encode" style="width: 120px;"><i class='bx bx-right-arrow-alt'></i> Encode</button>
                    <button class="btn-primary" id="url-decode" style="width: 120px;"><i class='bx bx-left-arrow-alt'></i> Decode</button>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="color: var(--text-secondary); font-weight: 500;">Output</label>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-secondary" id="url-copy-out" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-copy'></i> Copy</button>
                        </div>
                    </div>
                    <textarea id="url-output" class="input-field" style="height: 250px; resize: vertical; font-family: monospace; background: rgba(0,0,0,0.4);" placeholder="Result..."></textarea>
                </div>
            </div>
        </div>
    `;

    const input = container.querySelector('#url-input');
    const output = container.querySelector('#url-output');
    
    container.querySelector('#url-encode').addEventListener('click', () => {
        try {
            output.value = encodeURIComponent(input.value);
        } catch (e) {
            output.value = "Error encoding URL";
        }
    });

    container.querySelector('#url-decode').addEventListener('click', () => {
        try {
            output.value = decodeURIComponent(input.value);
        } catch (e) {
            output.value = "Error decoding URL. Invalid format.";
        }
    });

    container.querySelector('#url-clear').addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    container.querySelector('#url-paste-in').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            input.value = text;
        } catch (err) {
            console.error('Failed to read clipboard contents');
        }
    });

    container.querySelector('#url-copy-out').addEventListener('click', () => {
        const btn = container.querySelector('#url-copy-out');
        if (!output.value) return;
        navigator.clipboard.writeText(output.value);
        const ori = btn.innerHTML;
        btn.innerHTML = "<i class='bx bx-check'></i>";
        setTimeout(() => btn.innerHTML = ori, 1000);
    });
}
