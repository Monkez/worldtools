export function renderJsonFormatter(container) {
    container.innerHTML = `
        <div class="panel" style="display: flex; flex-direction: column; gap: 16px; height: 100%; min-height: 500px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 12px;">
                    <button class="btn-primary" id="json-format"><i class='bx bx-align-left'></i> Format / Prettify</button>
                    <button class="btn-secondary" id="json-minify"><i class='bx bx-collapse'></i> Minify</button>
                    <button class="btn-secondary" id="json-clear"><i class='bx bx-trash'></i> Clear</button>
                </div>
                <button class="btn-secondary" id="json-copy"><i class='bx bx-copy'></i> Copy</button>
            </div>
            
            <div id="json-error" style="display: none; padding: 12px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; color: #fca5a5; font-family: monospace; font-size: 14px; border-radius: 4px;">
            </div>

            <textarea id="json-input" class="input-field" style="flex: 1; resize: none; font-family: monospace; font-size: 14px; line-height: 1.5; padding: 16px;" placeholder="Paste your JSON here..."></textarea>
        </div>
    `;

    const input = container.querySelector('#json-input');
    const btnFormat = container.querySelector('#json-format');
    const btnMinify = container.querySelector('#json-minify');
    const btnClear = container.querySelector('#json-clear');
    const btnCopy = container.querySelector('#json-copy');
    const errorDiv = container.querySelector('#json-error');

    const processJson = (action) => {
        const val = input.value.trim();
        if (!val) return;
        
        errorDiv.style.display = 'none';
        
        try {
            const parsed = JSON.parse(val);
            if (action === 'format') {
                input.value = JSON.stringify(parsed, null, 4);
            } else if (action === 'minify') {
                input.value = JSON.stringify(parsed);
            }
        } catch (err) {
            errorDiv.innerText = "Invalid JSON: " + err.message;
            errorDiv.style.display = 'block';
        }
    };

    btnFormat.addEventListener('click', () => processJson('format'));
    btnMinify.addEventListener('click', () => processJson('minify'));
    
    btnClear.addEventListener('click', () => {
        input.value = '';
        errorDiv.style.display = 'none';
        input.focus();
    });

    btnCopy.addEventListener('click', () => {
        if (!input.value) return;
        navigator.clipboard.writeText(input.value);
        
        const originalIcon = btnCopy.innerHTML;
        btnCopy.innerHTML = "<i class='bx bx-check'></i> Copied!";
        btnCopy.style.background = "#10b981";
        btnCopy.style.borderColor = "#10b981";
        btnCopy.style.color = "#fff";
        setTimeout(() => {
            btnCopy.innerHTML = originalIcon;
            btnCopy.style.background = "";
            btnCopy.style.borderColor = "";
            btnCopy.style.color = "";
        }, 1500);
    });
}
