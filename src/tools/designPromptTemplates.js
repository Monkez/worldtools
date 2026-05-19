const STORAGE_KEY = 'design_prompt_templates';

const starterTemplates = [
    {
        id: 'starter-editorial',
        title: 'Editorial Product Showcase',
        prompt: 'Editorial product landing page, premium lifestyle photography, confident whitespace, crisp typography, subtle grid structure, soft natural lighting, refined brand palette, high-end commercial design.',
        image: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
                <defs>
                    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#f8fafc"/>
                        <stop offset="1" stop-color="#dbeafe"/>
                    </linearGradient>
                </defs>
                <rect width="900" height="600" fill="url(#bg)"/>
                <rect x="90" y="70" width="720" height="460" rx="28" fill="#ffffff" opacity="0.86"/>
                <rect x="140" y="130" width="260" height="340" rx="22" fill="#111827"/>
                <circle cx="270" cy="292" r="92" fill="#f59e0b"/>
                <rect x="460" y="150" width="260" height="26" rx="13" fill="#111827"/>
                <rect x="460" y="198" width="310" height="14" rx="7" fill="#64748b"/>
                <rect x="460" y="226" width="240" height="14" rx="7" fill="#94a3b8"/>
                <rect x="460" y="330" width="150" height="48" rx="12" fill="#2563eb"/>
                <rect x="630" y="330" width="110" height="48" rx="12" fill="#e2e8f0"/>
            </svg>
        `)
    },
    {
        id: 'starter-dashboard',
        title: 'Focused SaaS Dashboard',
        prompt: 'Operational SaaS dashboard UI, dense but calm layout, neutral dark interface, compact tables, clear status badges, restrained accent colors, practical information hierarchy, built for repeated daily use.',
        image: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
                <rect width="900" height="600" fill="#0f172a"/>
                <rect x="55" y="55" width="180" height="490" rx="18" fill="#111827"/>
                <rect x="260" y="55" width="585" height="96" rx="18" fill="#1f2937"/>
                <rect x="260" y="175" width="180" height="120" rx="16" fill="#1f2937"/>
                <rect x="465" y="175" width="180" height="120" rx="16" fill="#1f2937"/>
                <rect x="670" y="175" width="175" height="120" rx="16" fill="#1f2937"/>
                <rect x="260" y="320" width="585" height="225" rx="18" fill="#1f2937"/>
                <rect x="95" y="105" width="95" height="16" rx="8" fill="#e5e7eb"/>
                <rect x="95" y="170" width="105" height="12" rx="6" fill="#64748b"/>
                <rect x="95" y="210" width="85" height="12" rx="6" fill="#64748b"/>
                <rect x="300" y="92" width="210" height="20" rx="10" fill="#f8fafc"/>
                <rect x="300" y="360" width="500" height="12" rx="6" fill="#475569"/>
                <rect x="300" y="405" width="470" height="12" rx="6" fill="#475569"/>
                <rect x="300" y="450" width="520" height="12" rx="6" fill="#475569"/>
                <rect x="300" y="495" width="410" height="12" rx="6" fill="#475569"/>
                <circle cx="384" cy="235" r="34" fill="#14b8a6"/>
                <circle cx="589" cy="235" r="34" fill="#f97316"/>
                <circle cx="759" cy="235" r="34" fill="#6366f1"/>
            </svg>
        `)
    }
];

export function renderDesignPromptTemplates(container) {
    container.innerHTML = `
        <div class="dpt-shell">
            <div class="tool-header dpt-header">
                <div>
                    <h2><i class='bx bx-images'></i> Design Prompt Templates</h2>
                    <p>Save visual references with reusable design prompt templates.</p>
                </div>
                <button id="dpt-reset" class="btn-secondary"><i class='bx bx-refresh'></i> Reset samples</button>
            </div>

            <div class="dpt-composer">
                <div id="dpt-dropzone" class="dpt-dropzone" tabindex="0">
                    <input id="dpt-file" type="file" accept="image/*" hidden>
                    <img id="dpt-preview" alt="" style="display:none;">
                    <div id="dpt-empty-preview" class="dpt-empty-preview">
                        <i class='bx bx-image-add'></i>
                        <strong>Upload or paste image</strong>
                        <span>Click here, drag an image, or press Ctrl+V.</span>
                    </div>
                </div>
                <div class="dpt-fields">
                    <input id="dpt-title" class="input-field" placeholder="Template title">
                    <textarea id="dpt-prompt" class="input-field" placeholder="Paste or write the prompt template here..."></textarea>
                    <div class="dpt-actions">
                        <button id="dpt-clear" class="btn-secondary"><i class='bx bx-x'></i> Clear</button>
                        <button id="dpt-save" class="btn-primary"><i class='bx bx-plus'></i> Add template</button>
                    </div>
                </div>
            </div>

            <div id="dpt-grid" class="dpt-grid"></div>
        </div>

        <style>
            .dpt-shell {
                width: min(100%, 1220px);
                margin: 0 auto;
            }
            .dpt-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 16px;
            }
            .dpt-composer {
                display: grid;
                grid-template-columns: minmax(260px, 380px) minmax(280px, 1fr);
                gap: 18px;
                margin-bottom: 28px;
                padding: 18px;
                background: rgba(31, 41, 55, 0.7);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
            }
            .dpt-dropzone {
                aspect-ratio: 4 / 3;
                min-height: 220px;
                border: 1px dashed rgba(255,255,255,0.22);
                border-radius: 10px;
                background: rgba(0,0,0,0.18);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.2s;
            }
            .dpt-dropzone:hover,
            .dpt-dropzone.dragover {
                border-color: var(--accent-color);
                background: rgba(99,102,241,0.1);
            }
            .dpt-dropzone img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .dpt-empty-preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                text-align: center;
                color: var(--text-secondary);
                padding: 20px;
            }
            .dpt-empty-preview i {
                font-size: 46px;
                color: var(--accent-color);
            }
            .dpt-empty-preview strong {
                color: var(--text-primary);
                font-size: 16px;
            }
            .dpt-empty-preview span {
                font-size: 13px;
                line-height: 1.4;
            }
            .dpt-fields {
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .dpt-fields textarea {
                min-height: 170px;
                flex: 1;
                resize: vertical;
                line-height: 1.55;
            }
            .dpt-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                flex-wrap: wrap;
            }
            .dpt-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 24px;
                padding: 4px;
            }
            .dpt-card {
                min-width: 0;
                background: rgba(31, 41, 55, 0.64);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 24px rgba(0,0,0,0.22);
            }
            .dpt-card img {
                width: 100%;
                aspect-ratio: 4 / 3;
                object-fit: cover;
                background: rgba(0,0,0,0.2);
                transition: transform 0.24s ease, filter 0.24s ease;
            }
            .dpt-card:hover img {
                transform: scale(1.08);
                filter: saturate(1.08) contrast(1.04);
            }
            .dpt-card-body {
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .dpt-card-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }
            .dpt-card-title h3 {
                margin: 0;
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .dpt-delete {
                width: 34px;
                height: 34px;
                flex: 0 0 auto;
                border: none;
                border-radius: 8px;
                background: rgba(239,68,68,0.12);
                color: #fca5a5;
                cursor: pointer;
                font-size: 18px;
            }
            .dpt-prompt {
                max-height: 190px;
                overflow: auto;
                padding: 12px;
                border-radius: 8px;
                background: rgba(0,0,0,0.24);
                border: 1px solid rgba(255,255,255,0.05);
                color: #e5e7eb;
                font-size: 13px;
                line-height: 1.5;
                white-space: pre-wrap;
                word-break: break-word;
            }
            .dpt-copy {
                width: 100%;
            }
            .dpt-card-actions {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
            }
            .dpt-empty-state {
                grid-column: 1 / -1;
                color: var(--text-secondary);
                text-align: center;
                padding: 46px 20px;
                border: 1px dashed rgba(255,255,255,0.14);
                border-radius: 12px;
            }
            @media (max-width: 760px) {
                .dpt-header,
                .dpt-composer {
                    grid-template-columns: 1fr;
                    flex-direction: column;
                }
                .dpt-header .btn-secondary {
                    width: 100%;
                }
                .dpt-grid {
                    grid-template-columns: 1fr;
                }
                .dpt-card-actions {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    const fileInput = container.querySelector('#dpt-file');
    const dropzone = container.querySelector('#dpt-dropzone');
    const preview = container.querySelector('#dpt-preview');
    const emptyPreview = container.querySelector('#dpt-empty-preview');
    const titleInput = container.querySelector('#dpt-title');
    const promptInput = container.querySelector('#dpt-prompt');
    const saveBtn = container.querySelector('#dpt-save');
    const clearBtn = container.querySelector('#dpt-clear');
    const resetBtn = container.querySelector('#dpt-reset');
    const grid = container.querySelector('#dpt-grid');

    let imageData = '';
    let templates = loadTemplates();

    function loadTemplates() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (Array.isArray(saved)) return saved;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(starterTemplates));
        return [...starterTemplates];
    }

    function saveTemplates() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setImage(src) {
        imageData = src;
        preview.src = src;
        preview.style.display = 'block';
        emptyPreview.style.display = 'none';
    }

    function clearForm() {
        imageData = '';
        preview.removeAttribute('src');
        preview.style.display = 'none';
        emptyPreview.style.display = 'flex';
        titleInput.value = '';
        promptInput.value = '';
        fileInput.value = '';
    }

    function readFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
    }

    function renderTemplates() {
        if (templates.length === 0) {
            grid.innerHTML = '<div class="dpt-empty-state">No templates yet. Add one with an image and prompt above.</div>';
            return;
        }

        grid.innerHTML = templates.map((item, index) => `
            <article class="dpt-card">
                <img src="${item.image}" alt="${escapeHtml(item.title)}">
                <div class="dpt-card-body">
                    <div class="dpt-card-title">
                        <h3 title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
                        <button class="dpt-delete" data-index="${index}" title="Delete"><i class='bx bx-trash'></i></button>
                    </div>
                    <div class="dpt-prompt">${escapeHtml(item.prompt)}</div>
                    <div class="dpt-card-actions">
                        <button class="btn-secondary dpt-copy-preview" data-index="${index}"><i class='bx bx-image'></i> Copy preview</button>
                        <button class="btn-secondary dpt-copy" data-index="${index}"><i class='bx bx-copy'></i> Copy prompt</button>
                    </div>
                </div>
            </article>
        `).join('');

        grid.querySelectorAll('.dpt-copy').forEach(btn => {
            btn.addEventListener('click', async () => {
                const item = templates[Number(btn.dataset.index)];
                await navigator.clipboard.writeText(item.prompt);
                const original = btn.innerHTML;
                btn.innerHTML = "<i class='bx bx-check'></i> Copied";
                setTimeout(() => { btn.innerHTML = original; }, 1300);
            });
        });

        grid.querySelectorAll('.dpt-copy-preview').forEach(btn => {
            btn.addEventListener('click', async () => {
                const item = templates[Number(btn.dataset.index)];
                const original = btn.innerHTML;
                try {
                    await copyImageToClipboard(item.image);
                    btn.innerHTML = "<i class='bx bx-check'></i> Copied";
                } catch (err) {
                    btn.innerHTML = "<i class='bx bx-error'></i> Failed";
                }
                setTimeout(() => { btn.innerHTML = original; }, 1300);
            });
        });

        grid.querySelectorAll('.dpt-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                templates.splice(Number(btn.dataset.index), 1);
                saveTemplates();
                renderTemplates();
            });
        });
    }

    async function copyImageToClipboard(src) {
        if (!navigator.clipboard || !window.ClipboardItem) {
            throw new Error('Clipboard image copy is not supported.');
        }

        const blob = await imageSourceToPngBlob(src);
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);
    }

    function imageSourceToPngBlob(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Could not convert image.'));
                }, 'image/png');
            };
            img.onerror = () => reject(new Error('Could not load image.'));
            img.src = src;
        });
    }

    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => readFile(fileInput.files[0]));

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropzone.classList.remove('dragover');
        readFile(event.dataTransfer.files[0]);
    });

    const pasteHandler = (event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        if (imageItem) {
            readFile(imageItem.getAsFile());
            event.preventDefault();
            return;
        }

        const text = event.clipboardData?.getData('text');
        if (text && document.activeElement !== promptInput && document.activeElement !== titleInput) {
            promptInput.value = promptInput.value ? promptInput.value + '\n' + text : text;
            event.preventDefault();
        }
    };
    window.addEventListener('paste', pasteHandler);

    saveBtn.addEventListener('click', () => {
        const prompt = promptInput.value.trim();
        if (!imageData || !prompt) {
            if (!imageData) dropzone.focus();
            if (!prompt) promptInput.focus();
            return;
        }

        templates.unshift({
            id: 'tpl-' + Date.now(),
            title: titleInput.value.trim() || 'Untitled design template',
            prompt,
            image: imageData
        });
        saveTemplates();
        renderTemplates();
        clearForm();
    });

    clearBtn.addEventListener('click', clearForm);
    resetBtn.addEventListener('click', () => {
        templates = [...starterTemplates];
        saveTemplates();
        renderTemplates();
    });

    const observer = new MutationObserver(() => {
        if (!document.body.contains(container)) {
            window.removeEventListener('paste', pasteHandler);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    renderTemplates();
}
