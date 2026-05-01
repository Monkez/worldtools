import { removeBackground } from '@imgly/background-removal';

export function renderRemoveBackground(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1000px; margin: 0 auto;">
            <!-- Dropzone -->
            <div id="rb-dropzone" style="border: 2px dashed var(--accent-color); border-radius: var(--border-radius-lg); padding: 48px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(99, 102, 241, 0.05);">
                <i class='bx bx-cloud-upload' style="font-size: 64px; color: var(--accent-color); margin-bottom: 16px;"></i>
                <h3 style="color: #fff; margin-bottom: 8px;">Upload Images to Remove Background</h3>
                <p style="color: var(--text-secondary); font-size: 14px;">Drag & Drop multiple images here, or click to browse</p>
                <input type="file" id="rb-file" accept="image/*" multiple style="display: none;">
            </div>

            <!-- Global Actions -->
            <div id="rb-actions" style="display: none; margin-top: 24px; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
                <div>
                    <h3 style="color: #fff; margin: 0;"><span id="rb-count">0</span> images selected</h3>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn-secondary" id="rb-add-more"><i class='bx bx-plus'></i> Add More</button>
                    <button class="btn-primary" id="rb-process-all"><i class='bx bx-play'></i> Remove Backgrounds</button>
                </div>
            </div>

            <!-- Items List -->
            <div id="rb-items-list" style="margin-top: 24px; display: flex; flex-direction: column; gap: 24px;">
                <!-- Items injected here -->
            </div>
            
            <style>
                .rb-image-box.rb-checkerboard {
                    background-color: #ffffff;
                    background-image: 
                      linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                    border-radius: 8px;
                }
                .rb-item {
                    background: rgba(31, 41, 55, 0.4);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: var(--border-radius-md);
                    padding: 24px;
                    display: flex;
                    gap: 32px;
                    align-items: center;
                    position: relative;
                }
                .rb-item-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 24px;
                    cursor: pointer;
                }
                .rb-item-close:hover { color: #ef4444; }
                
                .rb-image-box {
                    width: 180px;
                    height: 180px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(0,0,0,0.2);
                }
                .rb-image-box img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .rb-item-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .rb-progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 12px;
                }
                .rb-progress-fill {
                    height: 100%;
                    background: var(--accent-color);
                    width: 0%;
                    transition: width 0.3s ease;
                }
            </style>
        </div>
    `;

    const dropzone = container.querySelector('#rb-dropzone');
    const fileInput = container.querySelector('#rb-file');
    const actionsPanel = container.querySelector('#rb-actions');
    const itemsList = container.querySelector('#rb-items-list');
    const countLabel = container.querySelector('#rb-count');
    const btnAddMore = container.querySelector('#rb-add-more');
    const btnProcessAll = container.querySelector('#rb-process-all');

    let filesData = [];
    let isProcessing = false;

    const renderItems = () => {
        itemsList.innerHTML = '';
        
        if (filesData.length > 0) {
            dropzone.style.display = 'none';
            actionsPanel.style.display = 'flex';
            countLabel.innerText = filesData.length;
        } else {
            dropzone.style.display = 'block';
            actionsPanel.style.display = 'none';
        }

        filesData.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'rb-item';
            
            const stateHtml = item.status === 'done' ? 
                `
                    <div style="margin-top: 16px;">
                        <span style="color: #10b981; font-weight: 500; font-size: 14px;"><i class='bx bx-check-circle'></i> Completed</span>
                    </div>
                    <div style="margin-top: 16px;">
                        <a href="${item.resultUrl}" download="removed-bg-${item.file.name}" class="btn-primary" style="display: inline-flex; text-decoration: none;">
                            <i class='bx bx-download'></i> Download
                        </a>
                    </div>
                ` : 
                item.status === 'processing' ?
                `
                    <h4 style="color: #fff; margin: 12px 0 0 0; font-size: 16px;">${item.statusText || 'Processing...'}</h4>
                    <div class="rb-progress-bar">
                        <div class="rb-progress-fill" style="width: ${item.progress}%"></div>
                    </div>
                ` :
                item.status === 'error' ?
                `
                    <div style="margin-top: 16px; color: #ef4444; font-size: 14px;">
                        <i class='bx bx-error'></i> Error: ${item.error}
                    </div>
                    <button class="btn-secondary rb-retry-btn" data-index="${index}" style="margin-top: 12px;">Retry</button>
                ` :
                `
                    <div style="margin-top: 16px; color: var(--text-secondary); font-size: 14px;">Ready to process</div>
                `;

            const resultBoxHtml = item.status === 'done' 
                ? `<div class="rb-image-box rb-checkerboard"><img src="${item.resultUrl}"></div>`
                : `<div class="rb-image-box" style="border: 2px dashed rgba(255,255,255,0.1); background: transparent;"><span style="color: var(--text-secondary); font-size: 13px;">Result</span></div>`;

            el.innerHTML = `
                <button class="rb-item-close" data-index="${index}" ${isProcessing ? 'disabled' : ''}><i class='bx bx-x'></i></button>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="rb-image-box"><img src="${item.originalUrl}"></div>
                    <i class='bx bx-right-arrow-alt' style="font-size: 24px; color: var(--text-secondary);"></i>
                    ${resultBoxHtml}
                </div>
                <div class="rb-item-info">
                    <h3 style="color: #fff; margin: 0 0 4px 0; font-size: 18px; word-break: break-all; padding-right: 24px;">${item.file.name}</h3>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 13px;">${(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    ${stateHtml}
                </div>
            `;

            itemsList.appendChild(el);
        });

        // Attach events to delete/retry buttons
        itemsList.querySelectorAll('.rb-item-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                filesData.splice(idx, 1);
                renderItems();
            });
        });

        itemsList.querySelectorAll('.rb-retry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                filesData[idx].status = 'pending';
                renderItems();
            });
        });
    };

    const addFiles = (files) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                filesData.push({
                    file: file,
                    originalUrl: URL.createObjectURL(file),
                    status: 'pending',
                    progress: 0,
                    statusText: '',
                    resultUrl: null
                });
            }
        }
        renderItems();
    };

    const processNext = async () => {
        const pendingItemIndex = filesData.findIndex(item => item.status === 'pending');
        
        if (pendingItemIndex === -1) {
            isProcessing = false;
            btnProcessAll.innerHTML = "<i class='bx bx-play'></i> Remove Backgrounds";
            btnProcessAll.disabled = false;
            renderItems(); // Re-enable buttons like the X button
            return; // All done
        }

        isProcessing = true;
        btnProcessAll.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processing...";
        btnProcessAll.disabled = true;

        const item = filesData[pendingItemIndex];
        item.status = 'processing';
        item.statusText = 'Initializing AI...';
        renderItems(); // Update UI to show processing state

        try {
            const imageBlob = await removeBackground(item.originalUrl, {
                progress: (key, current, total) => {
                    if (!total) return;
                    const percent = Math.round((current / total) * 100);
                    item.progress = percent;
                    if (key.includes('fetch')) {
                        item.statusText = `Downloading AI Model (${percent}%)...`;
                    } else if (key.includes('compute')) {
                        item.statusText = `Processing Image (${percent}%)...`;
                    }
                    renderItems();
                }
            });

            item.resultUrl = URL.createObjectURL(imageBlob);
            item.status = 'done';
            item.progress = 100;
        } catch (err) {
            item.status = 'error';
            item.error = err.message || "Failed to process";
        }

        renderItems();
        
        // Process next immediately
        processNext();
    };

    // Events
    dropzone.addEventListener('click', () => fileInput.click());
    btnAddMore.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) addFiles(e.target.files);
        fileInput.value = ''; // Reset input
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-color)';
        dropzone.style.background = 'rgba(99, 102, 241, 0.1)';
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-color)';
        dropzone.style.background = 'rgba(99, 102, 241, 0.05)';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-color)';
        dropzone.style.background = 'rgba(99, 102, 241, 0.05)';
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    });

    btnProcessAll.addEventListener('click', () => {
        if (!isProcessing) processNext();
    });
}
