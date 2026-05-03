export function renderConvertThings(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 900px; margin: 0 auto;">
            <!-- Dropzone -->
            <div id="ct-dropzone" style="border: 2px dashed var(--accent-color); border-radius: var(--border-radius-lg); padding: 64px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(99, 102, 241, 0.05);">
                <i class='bx bx-devices' style="font-size: 64px; color: var(--accent-color); margin-bottom: 16px;"></i>
                <h3 style="color: #fff; margin-bottom: 8px;">Upload Media to Convert</h3>
                <p style="color: var(--text-secondary); font-size: 14px;">Images, Audio, and Videos supported!</p>
                <input type="file" id="ct-file" accept="image/*,video/*,audio/*" style="display: none;">
            </div>

            <!-- Editor -->
            <div id="ct-editor" style="display: none; margin-top: 24px;">
                <div style="display: flex; gap: 32px; flex-wrap: wrap;">
                    
                    <div style="flex: 1; min-width: 300px; text-align: center;">
                        <div id="ct-preview-box" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-image: linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;">
                            <!-- Preview injected here -->
                        </div>
                        <p id="ct-file-info" style="color: var(--text-secondary); margin-top: 12px; font-size: 14px; font-weight: 500;"></p>
                    </div>

                    <div style="flex: 1; min-width: 300px;">
                        <h3 style="color: #fff; margin-top: 0; margin-bottom: 24px;">Conversion Settings</h3>
                        
                        <div class="form-group">
                            <label>Convert To</label>
                            <select id="ct-format" class="input-field" style="padding-right: 12px; cursor: pointer;">
                                <!-- Options injected based on file type -->
                            </select>
                        </div>

                        <div class="form-group" id="ct-quality-group" style="display: none; margin-top: 24px;">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Quality</span>
                                <span id="ct-quality-val" style="color: var(--accent-color); font-weight: bold;">80%</span>
                            </label>
                            <input type="range" id="ct-quality" min="1" max="100" value="80" style="width: 100%; margin-top: 8px; cursor: pointer;">
                        </div>

                        <div class="form-group" id="ct-server-info" style="display: none; margin-top: 24px;">
                            <p style="color: #60a5fa; font-size: 13px; background: rgba(96, 165, 250, 0.1); padding: 12px; border-radius: 6px; border: 1px solid rgba(96, 165, 250, 0.2); line-height: 1.5;">
                                <i class='bx bx-cloud-upload'></i> Video & Audio conversion requires connecting to the local backend server. Please be patient while it processes.
                            </p>
                        </div>

                        <div style="display: flex; gap: 16px; margin-top: 40px;">
                            <button class="btn-secondary" id="ct-reset" style="flex: 1;" disabled>
                                <i class='bx bx-refresh'></i> Start Over
                            </button>
                            <button class="btn-primary" id="ct-convert" style="flex: 2; height: 48px; font-size: 15px;">
                                <i class='bx bx-transfer'></i> Convert & Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const dropzone = container.querySelector('#ct-dropzone');
    const fileInput = container.querySelector('#ct-file');
    const editor = container.querySelector('#ct-editor');
    const previewBox = container.querySelector('#ct-preview-box');
    const fileInfo = container.querySelector('#ct-file-info');
    
    const formatSelect = container.querySelector('#ct-format');
    const qualityGroup = container.querySelector('#ct-quality-group');
    const qualitySlider = container.querySelector('#ct-quality');
    const qualityVal = container.querySelector('#ct-quality-val');
    const serverInfo = container.querySelector('#ct-server-info');
    
    const btnReset = container.querySelector('#ct-reset');
    const btnConvert = container.querySelector('#ct-convert');

    let currentFile = null;
    let fileCategory = ''; // 'image', 'video', 'audio'
    let imgElement = new Image();

    const loadFile = (file) => {
        if (!file) return;

        currentFile = file;
        const objectUrl = URL.createObjectURL(file);
        
        fileInfo.innerText = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        
        previewBox.innerHTML = '';
        formatSelect.innerHTML = '';
        
        if (file.type.startsWith('image/')) {
            fileCategory = 'image';
            imgElement.src = objectUrl;
            previewBox.innerHTML = `<img src="${objectUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">`;
            
            formatSelect.innerHTML = `
                <option value="png">PNG</option>
                <option value="jpeg">JPEG / JPG</option>
                <option value="webp">WEBP</option>
                <option value="x-icon">ICO (Icon)</option>
            `;
            serverInfo.style.display = 'none';
        } else if (file.type.startsWith('video/')) {
            fileCategory = 'video';
            previewBox.innerHTML = `<video src="${objectUrl}" controls style="max-width: 100%; max-height: 100%; border-radius: 4px;"></video>`;
            
            formatSelect.innerHTML = `
                <option value="mp4">MP4 Video</option>
                <option value="webm">WEBM Video</option>
                <option value="gif">GIF Animation</option>
                <option value="mp3">MP3 Audio (Extract)</option>
            `;
            serverInfo.style.display = 'block';
        } else if (file.type.startsWith('audio/')) {
            fileCategory = 'audio';
            previewBox.innerHTML = `
                <i class='bx bx-music' style="font-size: 64px; color: var(--accent-color); margin-bottom: 24px;"></i>
                <audio src="${objectUrl}" controls style="width: 100%;"></audio>
            `;
            
            formatSelect.innerHTML = `
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
                <option value="ogg">OGG</option>
                <option value="aac">AAC</option>
            `;
            serverInfo.style.display = 'block';
        } else {
            alert('Unsupported file type for conversion.');
            return;
        }

        dropzone.style.display = 'none';
        editor.style.display = 'block';
        btnReset.disabled = false;
        updateUI();
    };

    const updateUI = () => {
        const format = formatSelect.value;
        if (fileCategory === 'image' && (format === 'jpeg' || format === 'webp')) {
            qualityGroup.style.display = 'block';
        } else {
            qualityGroup.style.display = 'none';
        }
    };

    const convertImageClientSide = async () => {
        const format = formatSelect.value;
        const mimeType = format === 'x-icon' ? 'image/x-icon' : `image/${format}`;
        const quality = parseInt(qualitySlider.value) / 100;
        
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (format === 'jpeg') {
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

        if (format === 'x-icon') {
            canvas.toBlob(async (pngBlob) => {
                const pngBuffer = await pngBlob.arrayBuffer();
                const pngView = new Uint8Array(pngBuffer);
                const size = 6 + 16 + pngBuffer.byteLength;
                const icoBuffer = new ArrayBuffer(size);
                const view = new DataView(icoBuffer);
                
                view.setUint16(0, 0, true);
                view.setUint16(2, 1, true);
                view.setUint16(4, 1, true);
                
                const w = canvas.width >= 256 ? 0 : canvas.width;
                const h = canvas.height >= 256 ? 0 : canvas.height;
                view.setUint8(6, w);
                view.setUint8(7, h);
                view.setUint8(8, 0);
                view.setUint8(9, 0);
                view.setUint16(10, 1, true);
                view.setUint16(12, 32, true);
                view.setUint32(14, pngBuffer.byteLength, true);
                view.setUint32(18, 22, true);
                
                new Uint8Array(icoBuffer, 22).set(pngView);
                downloadBlob(new Blob([icoBuffer], { type: 'image/x-icon' }), 'ico');
            }, 'image/png');
        } else {
            canvas.toBlob((blob) => {
                downloadBlob(blob, format === 'jpeg' ? 'jpg' : format);
            }, mimeType, quality);
        }
    };

    const convertMediaServerSide = async () => {
        const format = formatSelect.value;
        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('format', format);

        try {
            const response = await fetch('http://127.0.0.1:3000/api/convert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server conversion failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
            a.href = url;
            a.download = `${baseName}-converted.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleConvert = async () => {
        btnConvert.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processing...";
        btnConvert.disabled = true;
        btnReset.disabled = true;

        if (fileCategory === 'image') {
            await convertImageClientSide();
        } else {
            await convertMediaServerSide();
        }

        btnConvert.innerHTML = "<i class='bx bx-transfer'></i> Convert & Download";
        btnConvert.disabled = false;
        btnReset.disabled = false;
    };

    // Events
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
    btnConvert.addEventListener('click', handleConvert);
    
    btnReset.addEventListener('click', () => {
        dropzone.style.display = 'block';
        editor.style.display = 'none';
        fileInput.value = '';
        currentFile = null;
    });
}
