import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';

export function renderMediaEditor(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1000px; margin: 0 auto; padding: 0;">
            <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;">
                <button id="tab-trim" style="flex: 1; background: none; border: none; padding: 16px; color: var(--accent-color); font-weight: 600; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid var(--accent-color); font-size: 15px;"><i class='bx bx-cut'></i> Trim / Cut Media</button>
                <button id="tab-merge" style="flex: 1; background: none; border: none; padding: 16px; color: var(--text-secondary); font-weight: 500; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid transparent; font-size: 15px;"><i class='bx bx-merge'></i> Merge / Join Media</button>
            </div>

            <div style="padding: 24px;">
                <!-- TRIM SECTION -->
                <div id="section-trim">
                    <div id="trim-dropzone" style="border: 2px dashed var(--accent-color); border-radius: var(--border-radius-lg); padding: 64px 24px; text-align: center; cursor: pointer; background: rgba(99, 102, 241, 0.05); transition: all 0.3s;">
                        <i class='bx bx-movie-play' style="font-size: 64px; color: var(--accent-color); margin-bottom: 16px;"></i>
                        <h3 style="color: #fff; margin-bottom: 8px;">Upload Media to Trim</h3>
                        <p style="color: var(--text-secondary); font-size: 14px;">Select Video or Audio (MP4, MP3, WAV, etc.)</p>
                        <input type="file" id="trim-file" accept="video/*,audio/*" style="display: none;">
                    </div>

                    <div id="trim-editor" style="display: none;">
                        
                        <!-- Professional Waveform Editor -->
                        <div style="background: #111827; border-radius: 12px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                            
                            <!-- Header -->
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                <div style="display: flex; gap: 12px;">
                                    <button id="btn-inline-trim" class="btn-secondary" style="padding: 6px 12px; font-size: 13px; background: rgba(255,255,255,0.05); cursor: pointer;"><i class='bx bx-cut'></i> Trim</button>
                                </div>
                                <div style="color: var(--text-secondary); font-size: 13px;" id="trim-filename">filename.mp3</div>
                                <button id="btn-reset-trim" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 20px;"><i class='bx bx-x-circle'></i></button>
                            </div>

                            <!-- Waveform -->
                            <div id="waveform-container" style="position: relative; width: 100%; height: 120px; background: rgba(0,0,0,0.2); border-radius: 6px; margin-bottom: 8px;"></div>
                            <div id="waveform-timeline" style="width: 100%; height: 20px; margin-bottom: 24px;"></div>

                            <!-- Controls Toolbar -->
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 12px 16px; border-radius: 8px;">
                                
                                <div style="display: flex; gap: 16px; align-items: center;">
                                    <button id="btn-play-pause" style="width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: 0.2s;">
                                        <i class='bx bx-play'></i>
                                    </button>
                                    
                                    <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;">
                                        <input type="text" id="trim-start" value="00:00.0" style="background: transparent; border: none; color: #fff; width: 60px; font-family: monospace; font-size: 14px; text-align: center; outline: none;">
                                        <i class='bx bx-sort-alt-2' style="color: var(--text-secondary); transform: rotate(90deg);"></i>
                                        <input type="text" id="trim-end" value="00:00.0" style="background: transparent; border: none; color: #fff; width: 60px; font-family: monospace; font-size: 14px; text-align: center; outline: none;">
                                    </div>
                                </div>

                                <div style="display: flex; gap: 12px; align-items: center;">
                                    <select id="trim-format" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 6px; outline: none; cursor: pointer; font-family: 'Outfit';">
                                        <option value="mp3">MP3</option>
                                        <option value="mp4">MP4</option>
                                        <option value="wav">WAV</option>
                                    </select>
                                    <button id="btn-do-trim" style="background: #fff; color: #000; border: none; padding: 8px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: 'Outfit'; transition: 0.2s;">Save</button>
                                </div>

                            </div>
                        </div>
                        
                    </div>
                </div>

                <!-- MERGE SECTION -->
                <div id="section-merge" style="display: none;">
                    <div id="merge-dropzone" style="border: 2px dashed #10b981; border-radius: var(--border-radius-lg); padding: 48px 24px; text-align: center; cursor: pointer; background: rgba(16, 185, 129, 0.05);">
                        <i class='bx bx-layer-plus' style="font-size: 48px; color: #10b981; margin-bottom: 16px;"></i>
                        <h3 style="color: #fff; margin-bottom: 8px;">Upload Multiple Files to Merge</h3>
                        <p style="color: var(--text-secondary); font-size: 14px;">Select multiple files at once. They must be of the same type/format.</p>
                        <input type="file" id="merge-file" accept="video/*,audio/*" multiple style="display: none;">
                    </div>

                    <div id="merge-editor" style="display: none; margin-top: 24px;">
                        <h4 style="color: #fff; margin-bottom: 12px;">Files to Merge (in order):</h4>
                        <div id="merge-list" style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 16px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;"></div>
                        
                        <button class="btn-primary" id="btn-do-merge" style="width: 100%; background: linear-gradient(135deg, #10b981, #059669);"><i class='bx bx-merge'></i> Start Merging</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Style override for Regions plugin -->
        <style>
            #waveform-container ::part(region) {
                background-color: rgba(6, 182, 212, 0.3) !important;
            }
            #waveform-container ::part(region-handle-left),
            #waveform-container ::part(region-handle-right) {
                width: 10px !important;
                background-color: #06b6d4 !important;
                opacity: 1 !important;
                border-radius: 4px;
                display: flex !important;
                align-items: center;
                justify-content: center;
            }
            #waveform-container ::part(region-handle-left)::after,
            #waveform-container ::part(region-handle-right)::after {
                content: "⋮";
                color: #0f172a;
                font-size: 16px;
                font-weight: bold;
                line-height: 1;
                margin-top: -2px;
            }
        </style>
    `;

    // Elements
    const tabTrim = container.querySelector('#tab-trim');
    const tabMerge = container.querySelector('#tab-merge');
    const secTrim = container.querySelector('#section-trim');
    const secMerge = container.querySelector('#section-merge');

    const trimDropzone = container.querySelector('#trim-dropzone');
    const trimFile = container.querySelector('#trim-file');
    const trimEditor = container.querySelector('#trim-editor');
    const trimFilename = container.querySelector('#trim-filename');
    const trimStart = container.querySelector('#trim-start');
    const trimEnd = container.querySelector('#trim-end');
    const trimFormat = container.querySelector('#trim-format');
    const btnPlayPause = container.querySelector('#btn-play-pause');
    const btnDoTrim = container.querySelector('#btn-do-trim');
    const btnInlineTrim = container.querySelector('#btn-inline-trim');
    const btnResetTrim = container.querySelector('#btn-reset-trim');

    const mergeDropzone = container.querySelector('#merge-dropzone');
    const mergeFile = container.querySelector('#merge-file');
    const mergeEditor = container.querySelector('#merge-editor');
    const mergeList = container.querySelector('#merge-list');
    const btnDoMerge = container.querySelector('#btn-do-merge');

    let currentTrimFile = null;
    let mergeFilesArray = [];
    let wavesurfer = null;
    let wsRegion = null;

    // Format Time Function (HH:MM:SS or MM:SS.ms)
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
    };

    const parseTime = (str) => {
        // Simple parser for HH:MM:SS.m or MM:SS.m
        const parts = str.split(':');
        let secs = 0;
        if (parts.length === 3) {
            secs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
        } else if (parts.length === 2) {
            secs = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
        }
        return secs;
    };

    // TABS
    tabTrim.addEventListener('click', () => {
        tabTrim.style.color = 'var(--accent-color)';
        tabTrim.style.borderBottomColor = 'var(--accent-color)';
        tabTrim.style.fontWeight = '600';
        tabMerge.style.color = 'var(--text-secondary)';
        tabMerge.style.borderBottomColor = 'transparent';
        tabMerge.style.fontWeight = '500';
        secTrim.style.display = 'block';
        secMerge.style.display = 'none';
    });

    tabMerge.addEventListener('click', () => {
        tabMerge.style.color = '#10b981';
        tabMerge.style.borderBottomColor = '#10b981';
        tabMerge.style.fontWeight = '600';
        tabTrim.style.color = 'var(--text-secondary)';
        tabTrim.style.borderBottomColor = 'transparent';
        tabTrim.style.fontWeight = '500';
        secMerge.style.display = 'block';
        secTrim.style.display = 'none';
    });

    // --- TRIM LOGIC ---
    trimDropzone.addEventListener('click', () => trimFile.click());
    
    // Drag and drop
    trimDropzone.addEventListener('dragover', (e) => { e.preventDefault(); trimDropzone.style.background = 'rgba(99, 102, 241, 0.1)'; });
    trimDropzone.addEventListener('dragleave', (e) => { e.preventDefault(); trimDropzone.style.background = 'rgba(99, 102, 241, 0.05)'; });
    trimDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) handleTrimFile(e.dataTransfer.files[0]);
    });

    trimFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleTrimFile(e.target.files[0]);
    });

    const handleTrimFile = (file) => {
        currentTrimFile = file;
        trimFilename.innerText = file.name;
        
        // Auto select format based on input
        if (file.type.includes('video')) {
            trimFormat.value = 'mp4';
        } else {
            trimFormat.value = 'mp3';
        }

        trimDropzone.style.display = 'none';
        trimEditor.style.display = 'block';

        initWaveSurfer(file);
    };

    const initWaveSurfer = (file) => {
        if (wavesurfer) {
            wavesurfer.destroy();
        }

        const wsContainer = container.querySelector('#waveform-container');
        const tlContainer = container.querySelector('#waveform-timeline');
        wsContainer.innerHTML = '';
        tlContainer.innerHTML = '';

        wavesurfer = WaveSurfer.create({
            container: wsContainer,
            waveColor: '#10b981', // Bright green from screenshot
            progressColor: '#059669',
            cursorColor: '#ffffff',
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 120,
            normalize: true,
            plugins: [
                TimelinePlugin.create({
                    container: tlContainer,
                    height: 20,
                    style: {
                        fontSize: '11px',
                        color: '#9ca3af'
                    }
                })
            ]
        });

        // Initialize Regions Plugin separately for WaveSurfer v7
        const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());

        wavesurfer.on('ready', () => {
            const duration = wavesurfer.getDuration();
            
            // Create a default region in the middle 50%
            wsRegions.clearRegions();
            wsRegion = wsRegions.addRegion({
                start: duration * 0.25,
                end: duration * 0.75,
                color: 'rgba(6, 182, 212, 0.2)',
                drag: true,
                resize: true
            });

            // Add floating time labels container
            const labelsContainer = document.createElement('div');
            labelsContainer.style.cssText = 'position: absolute; top: -20px; left: 0; right: 0; height: 20px; pointer-events: none; z-index: 10;';
            wsContainer.appendChild(labelsContainer);

            const labelLeft = document.createElement('div');
            labelLeft.style.cssText = 'position: absolute; top: 0; transform: translateX(-50%); color: #06b6d4; font-family: monospace; font-size: 12px; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;';
            
            const labelRight = document.createElement('div');
            labelRight.style.cssText = 'position: absolute; top: 0; transform: translateX(-50%); color: #06b6d4; font-family: monospace; font-size: 12px; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px;';

            labelsContainer.appendChild(labelLeft);
            labelsContainer.appendChild(labelRight);

            const updateLabels = () => {
                const dur = wavesurfer.getDuration();
                if (dur === 0) return;
                const startPct = (wsRegion.start / dur) * 100;
                const endPct = (wsRegion.end / dur) * 100;
                
                labelLeft.style.left = startPct + '%';
                labelRight.style.left = endPct + '%';
                
                labelLeft.innerText = formatTime(wsRegion.start);
                labelRight.innerText = formatTime(wsRegion.end);
            };

            trimStart.value = formatTime(wsRegion.start);
            trimEnd.value = formatTime(wsRegion.end);
            updateLabels();

            wsRegion.on('update', () => {
                trimStart.value = formatTime(wsRegion.start);
                trimEnd.value = formatTime(wsRegion.end);
                updateLabels();
            });
            
            // When region is clicked, play only that region
            wsRegion.on('click', (e) => {
                e.stopPropagation();
                wsRegion.play();
            });
        });

        wavesurfer.on('play', () => {
            btnPlayPause.innerHTML = "<i class='bx bx-pause'></i>";
        });

        wavesurfer.on('pause', () => {
            btnPlayPause.innerHTML = "<i class='bx bx-play'></i>";
        });

        const url = URL.createObjectURL(file);
        wavesurfer.load(url);
    };

    btnPlayPause.addEventListener('click', () => {
        if (!wavesurfer) return;
        if (wavesurfer.isPlaying()) {
            wavesurfer.pause();
        } else {
            if (wsRegion) {
                // Play from region start
                wavesurfer.setTime(wsRegion.start);
                wavesurfer.play();
            } else {
                wavesurfer.play();
            }
        }
    });

    trimStart.addEventListener('change', (e) => {
        if (!wsRegion) return;
        const secs = parseTime(e.target.value);
        if (!isNaN(secs) && secs < wsRegion.end) {
            wsRegion.setOptions({ start: secs });
        }
    });

    trimEnd.addEventListener('change', (e) => {
        if (!wsRegion) return;
        const secs = parseTime(e.target.value);
        if (!isNaN(secs) && secs > wsRegion.start) {
            wsRegion.setOptions({ end: secs });
        }
    });

    btnResetTrim.addEventListener('click', () => {
        if (wavesurfer) wavesurfer.destroy();
        wavesurfer = null;
        wsRegion = null;
        currentTrimFile = null;
        trimFile.value = '';
        trimEditor.style.display = 'none';
        trimDropzone.style.display = 'block';
    });

    btnDoTrim.addEventListener('click', async () => {
        if (!currentTrimFile || !wsRegion) return;
        
        btnDoTrim.innerHTML = "Saving...";
        btnDoTrim.disabled = true;

        const formData = new FormData();
        formData.append('file', currentTrimFile);
        formData.append('startTime', parseTime(trimStart.value).toString());
        formData.append('endTime', parseTime(trimEnd.value).toString()); 
        formData.append('format', trimFormat.value);
        
        try {
            const res = await fetch('http://127.0.0.1:3000/api/trim', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error(await res.text());
            
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `trimmed-${currentTrimFile.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
        } catch (err) {
            alert('Trim error: ' + err.message);
        }

        btnDoTrim.innerHTML = "Save";
        btnDoTrim.disabled = false;
    });

    btnInlineTrim.addEventListener('click', async () => {
        if (!currentTrimFile || !wsRegion) return;
        
        btnInlineTrim.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i>";
        btnInlineTrim.disabled = true;

        const formData = new FormData();
        formData.append('file', currentTrimFile);
        formData.append('startTime', parseTime(trimStart.value).toString());
        formData.append('endTime', parseTime(trimEnd.value).toString()); 
        formData.append('format', trimFormat.value);
        
        try {
            const res = await fetch('http://127.0.0.1:3000/api/trim', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error(await res.text());
            
            const blob = await res.blob();
            
            // Update the editor with the newly trimmed file (do not download)
            const newFileName = currentTrimFile.name.startsWith('trimmed-') 
                ? currentTrimFile.name 
                : `trimmed-${currentTrimFile.name}`;
                
            const newFile = new File([blob], newFileName, { type: currentTrimFile.type || 'video/mp4' });
            
            // Re-initialize the editor with the new file
            handleTrimFile(newFile);
            
        } catch (err) {
            alert('Trim error: ' + err.message);
        }

        btnInlineTrim.innerHTML = "<i class='bx bx-cut'></i> Trim";
        btnInlineTrim.disabled = false;
    });

    // --- MERGE LOGIC ---
    mergeDropzone.addEventListener('click', () => mergeFile.click());
    
    // Drag drop
    mergeDropzone.addEventListener('dragover', (e) => { e.preventDefault(); mergeDropzone.style.background = 'rgba(16, 185, 129, 0.1)'; });
    mergeDropzone.addEventListener('dragleave', (e) => { e.preventDefault(); mergeDropzone.style.background = 'rgba(16, 185, 129, 0.05)'; });
    mergeDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) handleMergeFiles(e.dataTransfer.files);
    });

    mergeFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleMergeFiles(e.target.files);
    });

    const handleMergeFiles = (files) => {
        mergeFilesArray = Array.from(files);
        
        mergeList.innerHTML = mergeFilesArray.map((f, i) => `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 4px; display: flex; align-items: center; gap: 12px;">
                <span style="color: #10b981; font-weight: bold;">${i + 1}.</span>
                <span style="color: #fff; flex: 1;">${f.name}</span>
                <span style="color: var(--text-secondary); font-size: 13px;">${(f.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
        `).join('');

        mergeDropzone.style.display = 'none';
        mergeEditor.style.display = 'block';
    };

    btnDoMerge.addEventListener('click', async () => {
        if (mergeFilesArray.length < 2) {
            alert("Please select at least 2 files to merge.");
            return;
        }

        btnDoMerge.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Merging...";
        btnDoMerge.disabled = true;

        const formData = new FormData();
        mergeFilesArray.forEach(f => formData.append('files', f));

        try {
            const res = await fetch('http://127.0.0.1:3000/api/merge', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error(await res.text());
            
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `merged-output.${mergeFilesArray[0].name.split('.').pop()}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            alert('Merge error: ' + err.message);
        }

        btnDoMerge.innerHTML = "<i class='bx bx-merge'></i> Start Merging";
        btnDoMerge.disabled = false;
    });
}
