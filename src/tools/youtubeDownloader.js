export function renderYoutubeDownloader(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
                <i class='bx bxl-youtube' style="font-size: 64px; color: #ef4444; margin-bottom: 16px;"></i>
                <h2 style="color: #fff; margin-bottom: 8px;">YouTube Video Downloader</h2>
                <p style="color: var(--text-secondary);">Download videos and audio in high quality.</p>
            </div>

            <div style="display: flex; gap: 12px; margin-bottom: 32px;">
                <div style="position: relative; flex: 1;">
                    <i class='bx bx-link' style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); font-size: 20px;"></i>
                    <input type="text" id="yt-url" class="input-field" placeholder="Paste YouTube link here... (e.g. https://www.youtube.com/watch?v=...)" style="padding-left: 48px; height: 56px; font-size: 16px;">
                </div>
                <button id="btn-fetch" class="btn-primary" style="height: 56px; padding: 0 32px; background: #ef4444; border-radius: var(--border-radius-lg); font-size: 16px;"><i class='bx bx-search'></i> Fetch Info</button>
            </div>

            <div id="loading-state" style="display: none; text-align: center; padding: 48px;">
                <i class='bx bx-loader-alt bx-spin' style="font-size: 48px; color: #ef4444; margin-bottom: 16px;"></i>
                <p style="color: var(--text-secondary);">Analyzing video...</p>
            </div>

            <div id="error-state" style="display: none; text-align: center; padding: 24px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; margin-bottom: 24px;">
                <i class='bx bx-error-circle' style="font-size: 32px; color: #ef4444; margin-bottom: 8px;"></i>
                <p id="error-text" style="color: #fca5a5;"></p>
            </div>

            <div id="result-state" style="display: none; background: rgba(0,0,0,0.2); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; flex-direction: column; md:flex-direction: row; gap: 24px; padding: 24px;">
                    
                    <div style="flex: 1;">
                        <div style="position: relative; padding-top: 56.25%; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                            <img id="vid-thumbnail" src="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                            <div id="vid-duration" style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; font-family: monospace;"></div>
                        </div>
                        <h3 id="vid-title" style="color: #fff; margin-top: 16px; margin-bottom: 0; font-size: 18px; line-height: 1.4;"></h3>
                    </div>

                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <h4 style="color: var(--text-secondary); margin-top: 0; margin-bottom: 16px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Available Formats</h4>
                        <div id="format-list" style="display: flex; flex-direction: column; gap: 12px; overflow-y: auto; max-height: 300px; padding-right: 8px;">
                            <!-- Formats will be injected here -->
                        </div>
                    </div>

                </div>
            </div>
            
            <div id="downloading-state" style="display: none; text-align: center; padding: 24px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; margin-top: 24px;">
                <i class='bx bx-cloud-download bx-fade-down' style="font-size: 32px; color: #10b981; margin-bottom: 12px;"></i>
                <p style="color: #6ee7b7; font-weight: 600; margin-bottom: 8px;">Download Started...</p>
                <p style="color: var(--text-secondary); font-size: 13px;">Please wait while the file is being prepared and downloaded by your browser.</p>
            </div>
        </div>
        
        <style>
            .format-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(255,255,255,0.05);
                padding: 12px 16px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.02);
                transition: 0.2s;
            }
            .format-card:hover {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.1);
            }
            .dl-btn {
                background: #ef4444;
                color: #fff;
                border: none;
                padding: 6px 16px;
                border-radius: 6px;
                font-family: 'Outfit', sans-serif;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .dl-btn:hover {
                background: #dc2626;
                transform: translateY(-2px);
            }
            .tag {
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: bold;
            }
            .tag-video { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
            .tag-audio { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        </style>
    `;

    const btnFetch = container.querySelector('#btn-fetch');
    const inputUrl = container.querySelector('#yt-url');
    const loadingState = container.querySelector('#loading-state');
    const errorState = container.querySelector('#error-state');
    const errorText = container.querySelector('#error-text');
    const resultState = container.querySelector('#result-state');
    const downloadingState = container.querySelector('#downloading-state');
    
    const vidThumbnail = container.querySelector('#vid-thumbnail');
    const vidTitle = container.querySelector('#vid-title');
    const vidDuration = container.querySelector('#vid-duration');
    const formatList = container.querySelector('#format-list');

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatBytes = (bytes) => {
        if (!bytes) return 'Unknown size';
        const kb = bytes / 1024;
        if (kb < 1024) return Math.round(kb) + ' KB';
        return (kb / 1024).toFixed(1) + ' MB';
    };

    btnFetch.addEventListener('click', async () => {
        const url = inputUrl.value.trim();
        if(!url) {
            errorText.innerText = "Please enter a valid YouTube URL.";
            errorState.style.display = 'block';
            return;
        }

        errorState.style.display = 'none';
        resultState.style.display = 'none';
        downloadingState.style.display = 'none';
        loadingState.style.display = 'block';
        btnFetch.disabled = true;

        try {
            const res = await fetch(`http://127.0.0.1:3000/api/yt/info?url=${encodeURIComponent(url)}`);
            if(!res.ok) throw new Error(await res.text());
            
            const data = await res.json();
            
            vidTitle.innerText = data.title;
            vidThumbnail.src = data.thumbnail;
            vidDuration.innerText = formatDuration(data.duration);
            
            formatList.innerHTML = '';
            
            data.formats.forEach(f => {
                const isVideo = f.hasVideo && f.hasAudio;
                const isAudioOnly = !f.hasVideo && f.hasAudio;
                
                const card = document.createElement('div');
                card.className = 'format-card';
                card.innerHTML = `
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="color: #fff; font-weight: 600; font-size: 15px;">${f.qualityLabel}</span>
                            <span class="tag ${isVideo ? 'tag-video' : 'tag-audio'}">${isVideo ? 'MP4 + AUDIO' : 'AUDIO ONLY'}</span>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 12px;">${isVideo ? 'High Quality Muxed' : 'Best Audio'}</div>
                    </div>
                    <button class="dl-btn" data-itag="${f.itag}"><i class='bx bx-download'></i> DL</button>
                `;
                formatList.appendChild(card);
            });

            // Attach download listeners
            formatList.querySelectorAll('.dl-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const itag = btn.getAttribute('data-itag');
                    triggerDownload(url, itag, btn);
                });
            });

            loadingState.style.display = 'none';
            resultState.style.display = 'block';

        } catch (err) {
            loadingState.style.display = 'none';
            errorText.innerText = err.message || "Failed to fetch video information.";
            errorState.style.display = 'block';
        }
        
        btnFetch.disabled = false;
    });

    const triggerDownload = async (url, itag, btn) => {
        downloadingState.style.display = 'block';
        // Smooth scroll to the downloading message
        downloadingState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Visual feedback on the button
        const originalHtml = btn.innerHTML;
        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Wait";
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';

        const dlUrl = `http://127.0.0.1:3000/api/yt/download?url=${encodeURIComponent(url)}&itag=${encodeURIComponent(itag)}&t=${Date.now()}`;
        
        try {
            const response = await fetch(dlUrl);
            if (!response.ok) {
                const errorTextStr = await response.text();
                throw new Error(errorTextStr || "Failed to download video");
            }
            
            // Get filename from Content-Disposition if available
            let filename = 'download.mp4';
            const disposition = response.headers.get('content-disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                    filename = matches[1].replace(/['"]/g, '');
                    // Handle URI encoded filenames
                    try { filename = decodeURIComponent(filename); } catch(e) {}
                }
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);

            downloadingState.style.display = 'none';
            btn.innerHTML = originalHtml;
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        } catch (err) {
            downloadingState.style.display = 'none';
            btn.innerHTML = originalHtml;
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            
            errorText.innerText = err.message || "An error occurred during download.";
            errorState.style.display = 'block';
            errorState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };
}
