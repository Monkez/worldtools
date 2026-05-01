export function renderImageConverter(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 900px; margin: 0 auto;">
            <!-- Dropzone -->
            <div id="ic-dropzone" style="border: 2px dashed var(--accent-color); border-radius: var(--border-radius-lg); padding: 64px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(99, 102, 241, 0.05);">
                <i class='bx bx-images' style="font-size: 64px; color: var(--accent-color); margin-bottom: 16px;"></i>
                <h3 style="color: #fff; margin-bottom: 8px;">Upload Image to Convert</h3>
                <p style="color: var(--text-secondary); font-size: 14px;">Drag & Drop an image here, or click to browse</p>
                <input type="file" id="ic-file" accept="image/*" style="display: none;">
            </div>

            <!-- Editor -->
            <div id="ic-editor" style="display: none; margin-top: 24px;">
                <div style="display: flex; gap: 32px; flex-wrap: wrap;">
                    
                    <div style="flex: 1; min-width: 300px; text-align: center;">
                        <div style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; height: 350px; display: flex; align-items: center; justify-content: center; background-image: linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;">
                            <img id="ic-preview" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                        </div>
                        <p id="ic-file-info" style="color: var(--text-secondary); margin-top: 12px; font-size: 14px; font-weight: 500;"></p>
                    </div>

                    <div style="flex: 1; min-width: 300px;">
                        <h3 style="color: #fff; margin-top: 0; margin-bottom: 24px;">Conversion Settings</h3>
                        
                        <div class="form-group">
                            <label>Convert To</label>
                            <select id="ic-format" class="input-field" style="appearance: auto; padding-right: 12px; cursor: pointer;">
                                <option value="image/png">PNG</option>
                                <option value="image/jpeg">JPEG / JPG</option>
                                <option value="image/webp">WEBP</option>
                                <option value="image/x-icon">ICO (Icon)</option>
                            </select>
                        </div>

                        <div class="form-group" id="ic-quality-group" style="display: none; margin-top: 24px;">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Quality</span>
                                <span id="ic-quality-val" style="color: var(--accent-color); font-weight: bold;">80%</span>
                            </label>
                            <input type="range" id="ic-quality" min="1" max="100" value="80" style="width: 100%; margin-top: 8px; cursor: pointer;">
                            <p style="color: var(--text-secondary); font-size: 12px; margin-top: 8px;">Lower quality means smaller file size.</p>
                        </div>

                        <div class="form-group" id="ic-ico-warn" style="display: none; margin-top: 24px;">
                            <p style="color: #fbbf24; font-size: 13px; background: rgba(251, 191, 36, 0.1); padding: 12px; border-radius: 6px; border: 1px solid rgba(251, 191, 36, 0.2); line-height: 1.5;">
                                <i class='bx bx-info-circle'></i> For best ICO results, use a square image with a transparent background. Image will be embedded directly as a high-quality icon.
                            </p>
                        </div>

                        <div style="display: flex; gap: 16px; margin-top: 40px;">
                            <button class="btn-secondary" id="ic-reset" style="flex: 1;">
                                <i class='bx bx-refresh'></i> Start Over
                            </button>
                            <button class="btn-primary" id="ic-convert" style="flex: 2; height: 48px; font-size: 15px;">
                                <i class='bx bx-transfer'></i> Convert & Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const dropzone = container.querySelector('#ic-dropzone');
    const fileInput = container.querySelector('#ic-file');
    const editor = container.querySelector('#ic-editor');
    const preview = container.querySelector('#ic-preview');
    const fileInfo = container.querySelector('#ic-file-info');
    
    const formatSelect = container.querySelector('#ic-format');
    const qualityGroup = container.querySelector('#ic-quality-group');
    const qualitySlider = container.querySelector('#ic-quality');
    const qualityVal = container.querySelector('#ic-quality-val');
    const icoWarn = container.querySelector('#ic-ico-warn');
    
    const btnReset = container.querySelector('#ic-reset');
    const btnConvert = container.querySelector('#ic-convert');

    let currentFile = null;
    let imgElement = new Image();

    const loadFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        currentFile = file;
        const objectUrl = URL.createObjectURL(file);
        preview.src = objectUrl;
        imgElement.src = objectUrl;
        
        fileInfo.innerText = `Original: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        
        dropzone.style.display = 'none';
        editor.style.display = 'block';
        updateUI();
    };

    const updateUI = () => {
        const format = formatSelect.value;
        if (format === 'image/jpeg' || format === 'image/webp') {
            qualityGroup.style.display = 'block';
            icoWarn.style.display = 'none';
        } else if (format === 'image/x-icon') {
            qualityGroup.style.display = 'none';
            icoWarn.style.display = 'block';
        } else {
            qualityGroup.style.display = 'none';
            icoWarn.style.display = 'none';
        }
    };

    const generateIco = async (canvas) => {
        return new Promise((resolve) => {
            // First convert to PNG
            canvas.toBlob(async (pngBlob) => {
                const pngBuffer = await pngBlob.arrayBuffer();
                const pngView = new Uint8Array(pngBuffer);
                
                // Total size = 6 (header) + 16 (dir entry) + png_size
                const size = 6 + 16 + pngBuffer.byteLength;
                const icoBuffer = new ArrayBuffer(size);
                const view = new DataView(icoBuffer);
                
                // ICONDIR Header
                view.setUint16(0, 0, true); // reserved
                view.setUint16(2, 1, true); // format: 1 = ico
                view.setUint16(4, 1, true); // count: 1
                
                // ICONDIRENTRY
                const w = canvas.width >= 256 ? 0 : canvas.width;
                const h = canvas.height >= 256 ? 0 : canvas.height;
                view.setUint8(6, w); // width
                view.setUint8(7, h); // height
                view.setUint8(8, 0); // color count
                view.setUint8(9, 0); // reserved
                view.setUint16(10, 1, true); // color planes
                view.setUint16(12, 32, true); // bpp
                view.setUint32(14, pngBuffer.byteLength, true); // size of image data
                view.setUint32(18, 22, true); // offset to image data (6 + 16)
                
                // Copy PNG data
                new Uint8Array(icoBuffer, 22).set(pngView);
                
                resolve(new Blob([icoBuffer], { type: 'image/x-icon' }));
            }, 'image/png');
        });
    };

    const convertImage = async () => {
        if (!currentFile || !imgElement.complete) return;

        const format = formatSelect.value;
        const quality = parseInt(qualitySlider.value) / 100;
        
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Fill white background for JPEG since it doesn't support transparency
        if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(imgElement, 0, 0);

        const downloadBlob = (blob, ext) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
            a.href = url;
            a.download = `${baseName}-converted.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        if (format === 'image/x-icon') {
            const icoBlob = await generateIco(canvas);
            downloadBlob(icoBlob, 'ico');
        } else {
            canvas.toBlob((blob) => {
                const ext = format.split('/')[1];
                downloadBlob(blob, ext === 'jpeg' ? 'jpg' : ext);
            }, format, quality);
        }
    };

    // Event Listeners
    dropzone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) loadFile(e.target.files[0]);
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
            loadFile(e.dataTransfer.files[0]);
        }
    });

    formatSelect.addEventListener('change', updateUI);
    qualitySlider.addEventListener('input', (e) => qualityVal.innerText = `${e.target.value}%`);
    btnConvert.addEventListener('click', convertImage);
    
    btnReset.addEventListener('click', () => {
        dropzone.style.display = 'block';
        editor.style.display = 'none';
        fileInput.value = '';
        currentFile = null;
    });
}
