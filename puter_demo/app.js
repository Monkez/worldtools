document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const navBtns = document.querySelectorAll('.nav-btn');
    const imageUploadGroup = document.getElementById('image-upload-group');
    const maskToolsGroup = document.getElementById('mask-tools-group');
    const workspaceView = document.getElementById('workspace-view');
    const runBtn = document.getElementById('run-btn');
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-upload');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resultContainer = document.getElementById('result-container');
    const modelSelect = document.getElementById('model-select');
    const promptInput = document.getElementById('prompt-input');
    const aspectRatioSelect = document.getElementById('aspect-ratio');
    const imgWidthInput = document.getElementById('img-width');
    const imgHeightInput = document.getElementById('img-height');

    // Canvas for masking
    const sourceCanvas = document.getElementById('source-canvas');
    const maskCanvas = document.getElementById('mask-canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    const brushSize = document.getElementById('brush-size');
    const clearMaskBtn = document.getElementById('clear-mask-btn');

    // State
    let currentMode = 'generate'; // 'generate', 'edit', 'mask'
    let sourceImage = null;
    let isDrawing = false;

    // --- Navigation Logic ---
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            updateUIMode();
        });
    });

    function updateUIMode() {
        if (currentMode === 'generate') {
            imageUploadGroup.style.display = 'none';
            maskToolsGroup.style.display = 'none';
            workspaceView.style.display = 'none';
        } else if (currentMode === 'edit') {
            imageUploadGroup.style.display = 'flex';
            maskToolsGroup.style.display = 'none';
            workspaceView.style.display = sourceImage ? 'flex' : 'none';
            maskCanvas.style.pointerEvents = 'none';
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        } else if (currentMode === 'mask') {
            imageUploadGroup.style.display = 'flex';
            maskToolsGroup.style.display = 'flex';
            workspaceView.style.display = sourceImage ? 'flex' : 'none';
            maskCanvas.style.pointerEvents = 'auto'; // Enable drawing
        }
    }

    // --- Image Upload Logic ---
    uploadArea.addEventListener('click', () => imageInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    });

    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                sourceImage = img;
                setupCanvases();
                workspaceView.style.display = 'flex';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function setupCanvases() {
        if (!sourceImage) return;
        
        // Match canvas size to image aspect ratio but limit max dimensions
        const maxDim = 800;
        let w = sourceImage.width;
        let h = sourceImage.height;
        
        if (w > maxDim || h > maxDim) {
            if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
            } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
            }
        }

        sourceCanvas.width = w;
        sourceCanvas.height = h;
        maskCanvas.width = w;
        maskCanvas.height = h;

        sourceCtx.drawImage(sourceImage, 0, 0, w, h);
        
        // Initial setup for mask canvas
        maskCtx.lineCap = 'round';
        maskCtx.lineJoin = 'round';
        maskCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    }

    // --- Mask Drawing Logic ---
    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    maskCanvas.addEventListener('mousedown', (e) => {
        if (currentMode !== 'mask') return;
        isDrawing = true;
        const pos = getMousePos(maskCanvas, e);
        maskCtx.beginPath();
        maskCtx.moveTo(pos.x, pos.y);
    });

    maskCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing || currentMode !== 'mask') return;
        const pos = getMousePos(maskCanvas, e);
        maskCtx.lineWidth = brushSize.value;
        maskCtx.lineTo(pos.x, pos.y);
        maskCtx.stroke();
    });

    maskCanvas.addEventListener('mouseup', () => { isDrawing = false; });
    maskCanvas.addEventListener('mouseleave', () => { isDrawing = false; });

    clearMaskBtn.addEventListener('click', () => {
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    });

    // --- AI Execution Logic ---
    runBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt && currentMode === 'generate') {
            alert('Please enter a prompt!');
            return;
        }

        const model = modelSelect.value;
        const aspectRatio = aspectRatioSelect.value;
        const imgWidth = imgWidthInput.value;
        const imgHeight = imgHeightInput.value;
        
        let apiOptions = { model };
        if (aspectRatio) apiOptions.aspect_ratio = aspectRatio;
        if (imgWidth) apiOptions.width = parseInt(imgWidth);
        if (imgHeight) apiOptions.height = parseInt(imgHeight);

        setLoading(true);
        resultContainer.innerHTML = '';
        
        try {
            let resultImg;
            
            if (currentMode === 'generate') {
                // Feature 1: Generate by prompt
                resultImg = await puter.ai.txt2img(prompt, apiOptions);
            } 
            else if (currentMode === 'edit') {
                // Feature 2: Edit by prompt
                if (!sourceImage) throw new Error("Please upload a source image first.");
                
                const imageDataUrl = sourceCanvas.toDataURL('image/png');
                
                // Attempt img2img logic
                if (typeof puter.ai.img2img === 'function') {
                     resultImg = await puter.ai.img2img(imageDataUrl, prompt, apiOptions);
                } else if (typeof puter.ai.imageEdit === 'function') {
                     resultImg = await puter.ai.imageEdit(imageDataUrl, prompt, apiOptions);
                } else {
                     // Fallback to passing image as an option in txt2img
                     apiOptions.image = imageDataUrl;
                     resultImg = await puter.ai.txt2img(prompt, apiOptions);
                }
            } 
            else if (currentMode === 'mask') {
                // Feature 3: Edit with mask (Inpainting)
                if (!sourceImage) throw new Error("Please upload a source image first.");
                
                const imageDataUrl = sourceCanvas.toDataURL('image/png');
                
                // Create mask layer data
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = maskCanvas.width;
                tempCanvas.height = maskCanvas.height;
                const tCtx = tempCanvas.getContext('2d');
                
                tCtx.fillStyle = 'white';
                tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tCtx.drawImage(maskCanvas, 0, 0);
                
                const maskDataUrl = maskCanvas.toDataURL('image/png');

                if (typeof puter.ai.inpaint === 'function') {
                    resultImg = await puter.ai.inpaint(imageDataUrl, maskDataUrl, prompt, apiOptions);
                } else if (typeof puter.ai.img2img === 'function') {
                    apiOptions.mask = maskDataUrl;
                    resultImg = await puter.ai.img2img(imageDataUrl, prompt, apiOptions);
                } else {
                    // Fallback to passing mask as an option
                    apiOptions.image = imageDataUrl;
                    apiOptions.mask = maskDataUrl;
                    resultImg = await puter.ai.txt2img(prompt, apiOptions);
                }
            }

            if (resultImg) {
                // Handle different response formats that might come back from API
                if (resultImg instanceof HTMLImageElement) {
                    resultContainer.appendChild(resultImg);
                } else if (typeof resultImg === 'string') {
                    const img = document.createElement('img');
                    img.src = resultImg;
                    resultContainer.appendChild(img);
                } else if (resultImg.url) {
                    const img = document.createElement('img');
                    img.src = resultImg.url;
                    resultContainer.appendChild(img);
                } else {
                    console.log("Raw Result:", resultImg);
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(new Blob([resultImg]));
                    resultContainer.appendChild(img);
                }
            }
        } catch (error) {
            console.error(error);
            const errorMsg = document.createElement('div');
            errorMsg.style.color = '#ef4444';
            errorMsg.style.padding = '20px';
            errorMsg.style.textAlign = 'center';
            errorMsg.innerHTML = `
                <h3 style="margin-bottom:10px;">API Error</h3>
                <p>${error.message || error}</p>
                <p style="margin-top:10px; font-size: 0.9em; color: #cbd5e1;">Puter API might currently only support pure txt2img out of the box in this version.</p>
            `;
            resultContainer.appendChild(errorMsg);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            loadingOverlay.style.display = 'flex';
            resultPlaceholder.style.display = 'none';
        } else {
            loadingOverlay.style.display = 'none';
            if (!resultContainer.hasChildNodes()) {
                resultPlaceholder.style.display = 'block';
            }
        }
    }
});
