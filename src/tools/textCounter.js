export function renderTextCounter(container) {
    container.innerHTML = `
        <div class="panel" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 8px;">
                <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 16px; text-align: center;">
                    <div style="font-size: 32px; font-weight: 700; color: var(--accent-color);" id="tc-chars">0</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Characters</div>
                </div>
                <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 16px; text-align: center;">
                    <div style="font-size: 32px; font-weight: 700; color: var(--accent-color);" id="tc-words">0</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Words</div>
                </div>
                <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 16px; text-align: center;">
                    <div style="font-size: 32px; font-weight: 700; color: var(--accent-color);" id="tc-lines">0</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Lines</div>
                </div>
                <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 16px; text-align: center;">
                    <div style="font-size: 32px; font-weight: 700; color: var(--accent-color);" id="tc-spaces">0</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Spaces</div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="color: var(--text-secondary); font-weight: 500;">Type or paste text below:</label>
                <button class="btn-secondary" id="tc-clear" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-trash'></i> Clear</button>
            </div>
            
            <textarea id="tc-input" class="input-field" style="height: 300px; resize: vertical; font-size: 15px; line-height: 1.6;" placeholder="Enter your text here..."></textarea>
        </div>
    `;

    const input = container.querySelector('#tc-input');
    const outChars = container.querySelector('#tc-chars');
    const outWords = container.querySelector('#tc-words');
    const outLines = container.querySelector('#tc-lines');
    const outSpaces = container.querySelector('#tc-spaces');
    const btnClear = container.querySelector('#tc-clear');

    const updateStats = () => {
        const text = input.value;
        
        outChars.innerText = text.length;
        outSpaces.innerText = (text.match(/ /g) || []).length;
        outLines.innerText = text.length === 0 ? 0 : text.split('\n').length;
        
        const words = text.trim().split(/\s+/);
        outWords.innerText = text.trim() === '' ? 0 : words.length;
    };

    input.addEventListener('input', updateStats);
    
    btnClear.addEventListener('click', () => {
        input.value = '';
        updateStats();
        input.focus();
    });
}
