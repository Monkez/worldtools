export function renderLoremIpsum(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 800px; margin: 0 auto;">
            <div style="display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
                <div class="form-group" style="margin: 0; flex: 1;">
                    <label>Paragraphs</label>
                    <input type="number" id="li-count" class="input-field" value="3" min="1" max="100">
                </div>
                <div class="form-group" style="margin: 0; flex: 1;">
                    <label>Length per Paragraph</label>
                    <select id="li-length" class="input-field" style="appearance: none;">
                        <option value="short">Short</option>
                        <option value="medium" selected>Medium</option>
                        <option value="long">Long</option>
                    </select>
                </div>
                <div style="display: flex; align-items: flex-end;">
                    <button class="btn-primary" id="li-generate" style="height: 48px; width: 150px;">
                        <i class='bx bx-refresh'></i> Generate
                    </button>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="color: var(--text-secondary); font-weight: 500;">Result</label>
                <button class="btn-secondary" id="li-copy" style="padding: 6px 12px; font-size: 13px;"><i class='bx bx-copy'></i> Copy Text</button>
            </div>
            <textarea id="li-result" class="input-field" style="height: 400px; resize: vertical; line-height: 1.6; font-size: 15px;" readonly></textarea>
        </div>
    `;

    const countInput = container.querySelector('#li-count');
    const lengthSelect = container.querySelector('#li-length');
    const btnGen = container.querySelector('#li-generate');
    const btnCopy = container.querySelector('#li-copy');
    const result = container.querySelector('#li-result');

    const words = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
        "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit",
        "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
        "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
        "mollit", "anim", "id", "est", "laborum"
    ];

    const generateSentence = (length) => {
        let wordCount = length === 'short' ? Math.floor(Math.random() * 5) + 5 : 
                        length === 'long' ? Math.floor(Math.random() * 15) + 15 : 
                        Math.floor(Math.random() * 10) + 8;
        
        let sentence = [];
        for (let i = 0; i < wordCount; i++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        return sentence.join(' ') + '.';
    };

    const generateParagraph = (length) => {
        let sentenceCount = length === 'short' ? Math.floor(Math.random() * 2) + 3 : 
                            length === 'long' ? Math.floor(Math.random() * 4) + 7 : 
                            Math.floor(Math.random() * 3) + 4;
        
        let paragraph = [];
        for (let i = 0; i < sentenceCount; i++) {
            paragraph.push(generateSentence(length));
        }
        return paragraph.join(' ');
    };

    const updateContent = () => {
        const count = parseInt(countInput.value) || 3;
        const length = lengthSelect.value;
        
        let paragraphs = [];
        for (let i = 0; i < count; i++) {
            paragraphs.push(generateParagraph(length));
        }
        
        result.value = paragraphs.join('\n\n');
    };

    btnGen.addEventListener('click', updateContent);

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(result.value);
        const ori = btnCopy.innerHTML;
        btnCopy.innerHTML = "<i class='bx bx-check'></i> Copied!";
        setTimeout(() => btnCopy.innerHTML = ori, 1500);
    });

    // Init
    updateContent();
}
