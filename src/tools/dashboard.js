import { tools, loadTool } from '../main.js';

let isEditing = false;
let layout = null;

export function renderDashboard(container) {
    // Initialize layout on first render to avoid circular dependency
    if (!layout) {
        layout = JSON.parse(localStorage.getItem('dashboardLayout'));
        if (!layout) {
            layout = tools.filter(t => !t.hidden).map(t => t.id);
        }
    }

    // Load bookmarks
    let bookmarks = JSON.parse(localStorage.getItem('dashboard-bookmarks') || '[]');

    container.innerHTML = `
        <style>
            .bookmarks-section { margin-top: 32px; }
            .bookmarks-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
            .bookmarks-header h3 { margin:0; font-size:15px; display:flex; align-items:center; gap:8px; color:var(--text-secondary); }
            .bookmarks-list { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
            .bookmark-chip {
                display:inline-flex; align-items:center; gap:7px; padding:6px 14px 6px 10px;
                background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);
                border-radius:20px; cursor:pointer; transition:all .2s; text-decoration:none;
                max-width:200px; position:relative;
            }
            .bookmark-chip:hover { background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.2); transform:translateY(-1px); }
            .bookmark-chip img { width:16px; height:16px; border-radius:3px; flex-shrink:0; }
            .bookmark-chip span { font-size:13px; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500; }
            .bookmark-chip .bm-del {
                position:absolute; top:-6px; right:-6px; width:18px; height:18px; border-radius:50%;
                background:#ef4444; color:#fff; border:none; font-size:12px; cursor:pointer;
                display:none; align-items:center; justify-content:center; line-height:1;
            }
            .bookmark-chip:hover .bm-del { display:flex; }
            .bookmark-add-chip {
                display:inline-flex; align-items:center; gap:6px; padding:6px 14px;
                background:rgba(99,102,241,0.1); border:1px dashed rgba(99,102,241,0.3);
                border-radius:20px; cursor:pointer; transition:all .2s; font-size:13px;
                color:var(--accent-color); font-weight:500;
            }
            .bookmark-add-chip:hover { background:rgba(99,102,241,0.2); border-color:var(--accent-color); }
            .bookmark-add-chip i { font-size:16px; }
            .bm-modal-overlay {
                position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,.55);
                backdrop-filter:blur(4px); z-index:2000; display:flex; align-items:center; justify-content:center;
            }
            .bm-modal {
                background:var(--bg-panel); border:1px solid rgba(255,255,255,.1); border-radius:16px;
                padding:24px; width:90%; max-width:400px; box-shadow:0 20px 40px rgba(0,0,0,.4);
                animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .bm-modal h3 { margin:0 0 16px 0; font-size:17px; display:flex; align-items:center; gap:8px; }
            .bm-modal input {
                width:100%; padding:10px 14px; background:rgba(0,0,0,.25); border:1px solid var(--border-color);
                border-radius:8px; color:var(--text-primary); font-size:14px; font-family:'Outfit',sans-serif;
                margin-bottom:12px; box-sizing:border-box;
            }
            .bm-modal input:focus { outline:none; border-color:var(--accent-color); }
            .bm-modal-actions { display:flex; gap:8px; justify-content:flex-end; }
            .bm-modal-actions button { padding:8px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:'Outfit',sans-serif; }
            .bm-btn-cancel { background:rgba(255,255,255,.1); color:var(--text-primary); }
            .bm-btn-save { background:var(--accent-color); color:#fff; }
        </style>

        <div class="dashboard-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
            <h2 style="margin:0; display:flex; align-items:center; gap:8px;"><i class='bx bx-grid-alt'></i> My Dashboard</h2>
            <button id="edit-dashboard-btn" class="btn-secondary" style="padding: 8px 16px;">
                <i class='bx ${isEditing ? 'bx-check' : 'bx-edit'}'></i> ${isEditing ? 'Done' : 'Edit Dashboard'}
            </button>
        </div>
        <div class="dashboard-grid" id="dashboard-grid"></div>
        
        <div id="available-apps-container" style="display: ${isEditing ? 'block' : 'none'}; margin-top: 40px;">
            <h3 style="margin-bottom: 16px; border-top: 1px solid var(--border-color); padding-top: 24px;">Available Apps</h3>
            <div class="dashboard-grid" id="available-grid"></div>
        </div>

        <div class="bookmarks-section">
            <div class="bookmarks-header">
                <h3><i class='bx bx-bookmarks'></i> Bookmarks</h3>
            </div>
            <div class="bookmarks-list" id="bookmarks-list"></div>
        </div>
    `;

    const grid = container.querySelector('#dashboard-grid');
    const availableGrid = container.querySelector('#available-grid');
    const editBtn = container.querySelector('#edit-dashboard-btn');
    const bookmarksList = container.querySelector('#bookmarks-list');

    // ====== BOOKMARKS ======
    function getFavicon(url) {
        try {
            const u = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`;
        } catch { return ''; }
    }

    function getShortName(url, customName) {
        if (customName) return customName;
        try {
            const u = new URL(url);
            return u.hostname.replace('www.', '').split('.')[0];
        } catch { return url; }
    }

    function saveBookmarks() {
        localStorage.setItem('dashboard-bookmarks', JSON.stringify(bookmarks));
    }

    function renderBookmarks() {
        bookmarksList.innerHTML = '';
        bookmarks.forEach((bm, idx) => {
            const chip = document.createElement('a');
            chip.className = 'bookmark-chip';
            chip.href = bm.url;
            chip.target = '_blank';
            chip.rel = 'noopener';
            chip.title = bm.url;
            chip.innerHTML = `
                <img src="${getFavicon(bm.url)}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text y=%2214%22 font-size=%2214%22>🔗</text></svg>'">
                <span>${getShortName(bm.url, bm.name)}</span>
                <button class="bm-del" data-idx="${idx}" title="Remove">×</button>
            `;
            chip.querySelector('.bm-del').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                bookmarks.splice(idx, 1);
                saveBookmarks();
                renderBookmarks();
            });
            bookmarksList.appendChild(chip);
        });

        // Add button
        const addBtn = document.createElement('div');
        addBtn.className = 'bookmark-add-chip';
        addBtn.innerHTML = `<i class='bx bx-plus'></i> Add`;
        addBtn.addEventListener('click', showAddBookmarkModal);
        bookmarksList.appendChild(addBtn);
    }

    function showAddBookmarkModal() {
        const overlay = document.createElement('div');
        overlay.className = 'bm-modal-overlay';
        overlay.innerHTML = `
            <div class="bm-modal">
                <h3><i class='bx bx-bookmark-plus' style="color:var(--accent-color)"></i> Add Bookmark</h3>
                <input type="text" id="bm-url-input" placeholder="https://example.com" autofocus>
                <input type="text" id="bm-name-input" placeholder="Display name (optional)">
                <div class="bm-modal-actions">
                    <button class="bm-btn-cancel" id="bm-cancel">Cancel</button>
                    <button class="bm-btn-save" id="bm-save">Add</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const urlInput = overlay.querySelector('#bm-url-input');
        const nameInput = overlay.querySelector('#bm-name-input');

        overlay.querySelector('#bm-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        overlay.querySelector('#bm-save').addEventListener('click', () => {
            let url = urlInput.value.trim();
            if (!url) return;
            if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
            const name = nameInput.value.trim() || '';
            bookmarks.push({ url, name });
            saveBookmarks();
            renderBookmarks();
            overlay.remove();
        });

        urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('#bm-save').click(); });
        nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') overlay.querySelector('#bm-save').click(); });
    }

    renderBookmarks();

    // ====== APP GRID ======
    function renderGrids() {
        grid.innerHTML = '';
        availableGrid.innerHTML = '';

        // Render Active Apps
        layout.forEach(id => {
            const tool = tools.find(t => t.id === id);
            if (!tool) return;
            const card = createCard(tool, true);
            grid.appendChild(card);
        });

        // Render Available Apps
        const availableTools = tools.filter(t => !t.hidden && !layout.includes(t.id));
        availableTools.forEach(tool => {
            const card = createCard(tool, false);
            availableGrid.appendChild(card);
        });
        
        setupDragAndDrop();
    }

    function createCard(tool, isActive) {
        const card = document.createElement('div');
        card.className = `dashboard-card ${isEditing && isActive ? 'draggable' : ''}`;
        card.dataset.id = tool.id;
        if (isEditing && isActive) card.draggable = true;

        let actionBtn = '';
        if (isEditing) {
            if (isActive) {
                actionBtn = `<button class="action-btn remove-btn" title="Remove"><i class='bx bx-x'></i></button>`;
            } else {
                actionBtn = `<button class="action-btn add-btn" title="Add"><i class='bx bx-plus'></i></button>`;
            }
        }

        card.innerHTML = `
            ${actionBtn}
            <i class='bx ${tool.icon} icon'></i>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
        `;

        if (!isEditing) {
            card.addEventListener('click', () => {
                loadTool(tool.id);
            });
        } else {
            const btn = card.querySelector('.action-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isActive) {
                        layout = layout.filter(id => id !== tool.id);
                    } else {
                        layout.push(tool.id);
                    }
                    saveLayout();
                    renderGrids();
                });
            }
        }

        return card;
    }

    function saveLayout() {
        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    }

    let dragSrcEl = null;

    function setupDragAndDrop() {
        if (!isEditing) return;
        
        const items = grid.querySelectorAll('.dashboard-card.draggable');
        items.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.id);
        setTimeout(() => {
            this.classList.add('dragging');
        }, 0);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); 
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        if (this !== dragSrcEl) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); 
        }
        if (dragSrcEl !== this) {
            const srcId = dragSrcEl.dataset.id;
            const targetId = this.dataset.id;
            
            const srcIdx = layout.indexOf(srcId);
            const targetIdx = layout.indexOf(targetId);
            
            layout.splice(srcIdx, 1);
            layout.splice(targetIdx, 0, srcId);
            
            saveLayout();
            renderGrids();
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        const items = grid.querySelectorAll('.dashboard-card');
        items.forEach(item => {
            item.classList.remove('over');
        });
    }

    editBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        renderDashboard(container);
    });

    renderGrids();
}
