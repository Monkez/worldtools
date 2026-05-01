import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

export function renderHashGenerator(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1100px; margin: 0 auto; padding: 0;">
            
            <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;">
                <button id="tab-text" class="hub-tab active" style="flex: 1; background: none; border: none; padding: 16px; color: var(--accent-color); font-weight: 600; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid var(--accent-color); font-size: 15px;"><i class='bx bx-text'></i> Text Hashing</button>
                <button id="tab-file" class="hub-tab" style="flex: 1; background: none; border: none; padding: 16px; color: var(--text-secondary); font-weight: 500; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid transparent; font-size: 15px;"><i class='bx bx-file'></i> File Checksum</button>
                <button id="tab-bcrypt" class="hub-tab" style="flex: 1; background: none; border: none; padding: 16px; color: var(--text-secondary); font-weight: 500; font-family: 'Outfit'; cursor: pointer; border-bottom: 2px solid transparent; font-size: 15px;"><i class='bx bx-lock-alt'></i> Bcrypt</button>
            </div>

            <div style="padding: 24px;">
                
                <!-- TAB 1: TEXT HASHING -->
                <div id="section-text" style="display: flex; gap: 24px; flex-direction: column;">
                    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 300px;">
                            <label style="color: var(--text-secondary); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Input Text</label>
                            <textarea id="hash-input" class="input-field" style="height: 150px; resize: none; font-family: monospace;" placeholder="Type or paste text here..."></textarea>
                            
                            <div style="margin-top: 16px; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #fff; font-weight: 500; margin-bottom: 12px;">
                                    <input type="checkbox" id="hmac-toggle"> Enable HMAC (Advanced)
                                </label>
                                <div id="hmac-key-container" style="display: none;">
                                    <input type="text" id="hmac-key" class="input-field" placeholder="Secret Key" style="font-family: monospace;">
                                </div>
                            </div>
                        </div>
                        
                        <div style="flex: 1.5; min-width: 400px; display: flex; flex-direction: column; gap: 12px;">
                            <label style="color: var(--text-secondary); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Live Hashes</label>
                            
                            <div class="hash-card">
                                <div class="hash-header"><span>MD5</span> <button class="icon-btn copy-hash" data-target="md5-out"><i class='bx bx-copy'></i></button></div>
                                <div id="md5-out" class="hash-value">-</div>
                            </div>
                            
                            <div class="hash-card">
                                <div class="hash-header"><span>SHA-1</span> <button class="icon-btn copy-hash" data-target="sha1-out"><i class='bx bx-copy'></i></button></div>
                                <div id="sha1-out" class="hash-value">-</div>
                            </div>
                            
                            <div class="hash-card">
                                <div class="hash-header"><span>SHA-256</span> <button class="icon-btn copy-hash" data-target="sha256-out"><i class='bx bx-copy'></i></button></div>
                                <div id="sha256-out" class="hash-value">-</div>
                            </div>
                            
                            <div class="hash-card">
                                <div class="hash-header"><span>SHA-512</span> <button class="icon-btn copy-hash" data-target="sha512-out"><i class='bx bx-copy'></i></button></div>
                                <div id="sha512-out" class="hash-value">-</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: FILE CHECKSUM -->
                <div id="section-file" style="display: none; gap: 24px; flex-direction: column;">
                    <div id="file-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; transition: 0.2s; background: rgba(0,0,0,0.1);">
                        <i class='bx bx-cloud-upload' style="font-size: 48px; color: var(--accent-color); margin-bottom: 16px;"></i>
                        <h3 style="margin-top: 0; color: #fff;">Click or Drop a file here</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 0;">Calculates MD5 and SHA-256 completely offline in your browser.</p>
                        <input type="file" id="file-input" style="display: none;">
                    </div>
                    
                    <div id="file-info" style="display: none; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                        <div style="color: #fff; font-weight: bold; font-size: 16px;" id="file-name">filename.ext</div>
                        <div style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;" id="file-size">0 KB</div>
                    </div>

                    <div id="file-progress" style="display: none; text-align: center; margin: 16px 0;">
                        <i class='bx bx-loader-alt bx-spin' style="font-size: 32px; color: var(--accent-color);"></i>
                        <div style="color: var(--text-secondary); margin-top: 8px;">Calculating Hashes...</div>
                    </div>

                    <div id="file-results" style="display: none; flex-direction: column; gap: 12px;">
                        <div class="hash-card">
                            <div class="hash-header"><span>MD5</span> <button class="icon-btn copy-hash" data-target="file-md5-out"><i class='bx bx-copy'></i></button></div>
                            <div id="file-md5-out" class="hash-value">-</div>
                        </div>
                        <div class="hash-card">
                            <div class="hash-header"><span>SHA-256</span> <button class="icon-btn copy-hash" data-target="file-sha256-out"><i class='bx bx-copy'></i></button></div>
                            <div id="file-sha256-out" class="hash-value">-</div>
                        </div>
                    </div>
                </div>

                <!-- TAB 3: BCRYPT -->
                <div id="section-bcrypt" style="display: none; gap: 24px; flex-direction: row; flex-wrap: wrap;">
                    
                    <div style="flex: 1; min-width: 300px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 16px;"><i class='bx bx-lock-alt' style="color: #f43f5e;"></i> Bcrypt Hash Generator</h3>
                        <div class="form-group">
                            <label>Password String</label>
                            <input type="text" id="bcrypt-input" class="input-field" placeholder="Enter password...">
                        </div>
                        <div class="form-group" style="margin-top: 16px;">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Salt Rounds (Cost)</span>
                                <span id="bcrypt-cost-val" style="color: #f43f5e; font-weight: bold;">10</span>
                            </label>
                            <input type="range" id="bcrypt-cost" min="4" max="15" value="10" style="width: 100%; margin-top: 8px;">
                            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Higher cost = exponentially slower to generate and crack.</div>
                        </div>
                        <button id="btn-gen-bcrypt" class="btn-primary" style="width: 100%; margin-top: 16px; background: #f43f5e;"><i class='bx bx-cog'></i> Generate Bcrypt</button>
                        
                        <div style="margin-top: 24px;">
                            <label style="color: var(--text-secondary); font-size: 12px;">Result:</label>
                            <div style="display: flex; gap: 8px; margin-top: 8px;">
                                <input type="text" id="bcrypt-out" class="input-field" readonly style="font-family: monospace; font-size: 14px;" placeholder="...">
                                <button class="btn-secondary copy-hash" data-target="bcrypt-out" style="padding: 0 16px;"><i class='bx bx-copy'></i></button>
                            </div>
                        </div>
                    </div>

                    <div style="flex: 1; min-width: 300px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="margin-top: 0; color: #fff; margin-bottom: 16px;"><i class='bx bx-check-shield' style="color: #10b981;"></i> Bcrypt Verifier</h3>
                        <div class="form-group">
                            <label>Hash to Verify</label>
                            <input type="text" id="bcrypt-verify-hash" class="input-field" placeholder="$2a$10$..." style="font-family: monospace;">
                        </div>
                        <div class="form-group" style="margin-top: 16px;">
                            <label>Password String</label>
                            <input type="text" id="bcrypt-verify-pass" class="input-field" placeholder="Enter password to check...">
                        </div>
                        <button id="btn-verify-bcrypt" class="btn-primary" style="width: 100%; margin-top: 24px; background: #10b981;"><i class='bx bx-search-alt-2'></i> Check Match</button>
                        
                        <div id="bcrypt-verify-result" style="margin-top: 24px; text-align: center; font-size: 18px; font-weight: bold; padding: 16px; border-radius: 8px; display: none;">
                        </div>
                    </div>

                </div>

            </div>
        </div>

        <style>
            .hash-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 12px 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .hash-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: var(--text-secondary);
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1px;
            }
            .hash-value {
                color: #fff;
                font-family: monospace;
                font-size: 14px;
                word-break: break-all;
                line-height: 1.4;
            }
        </style>
    `;

    // Tab Logic
    const tabs = ['text', 'file', 'bcrypt'];
    tabs.forEach(tab => {
        const btn = container.querySelector('#tab-' + tab);
        btn.addEventListener('click', () => {
            tabs.forEach(t => {
                const b = container.querySelector('#tab-' + t);
                const s = container.querySelector('#section-' + t);
                b.style.color = 'var(--text-secondary)';
                b.style.borderBottomColor = 'transparent';
                b.style.fontWeight = '500';
                s.style.display = 'none';
            });
            btn.style.color = 'var(--accent-color)';
            btn.style.borderBottomColor = 'var(--accent-color)';
            btn.style.fontWeight = '600';
            container.querySelector('#section-' + tab).style.display = 'flex';
        });
    });

    // Copy Hash Logic
    container.querySelectorAll('.copy-hash').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = container.querySelector('#' + targetId);
            const text = targetEl.tagName === 'INPUT' ? targetEl.value : targetEl.innerText;
            if (text && text !== '-') {
                navigator.clipboard.writeText(text);
                const oldIcon = btn.innerHTML;
                btn.innerHTML = "<i class='bx bx-check'></i>";
                btn.style.color = '#10b981';
                setTimeout(() => {
                    btn.innerHTML = oldIcon;
                    btn.style.color = '';
                }, 1500);
            }
        });
    });

    // ==========================================
    // TEXT HASHING
    // ==========================================
    const txtInput = container.querySelector('#hash-input');
    const hmacToggle = container.querySelector('#hmac-toggle');
    const hmacKeyContainer = container.querySelector('#hmac-key-container');
    const hmacKey = container.querySelector('#hmac-key');

    const outMd5 = container.querySelector('#md5-out');
    const outSha1 = container.querySelector('#sha1-out');
    const outSha256 = container.querySelector('#sha256-out');
    const outSha512 = container.querySelector('#sha512-out');

    hmacToggle.addEventListener('change', (e) => {
        hmacKeyContainer.style.display = e.target.checked ? 'block' : 'none';
        updateTextHashes();
    });

    const updateTextHashes = () => {
        const text = txtInput.value;
        if (!text) {
            outMd5.innerText = '-';
            outSha1.innerText = '-';
            outSha256.innerText = '-';
            outSha512.innerText = '-';
            return;
        }

        const isHmac = hmacToggle.checked;
        const key = hmacKey.value;

        if (isHmac && key) {
            outMd5.innerText = CryptoJS.HmacMD5(text, key).toString(CryptoJS.enc.Hex);
            outSha1.innerText = CryptoJS.HmacSHA1(text, key).toString(CryptoJS.enc.Hex);
            outSha256.innerText = CryptoJS.HmacSHA256(text, key).toString(CryptoJS.enc.Hex);
            outSha512.innerText = CryptoJS.HmacSHA512(text, key).toString(CryptoJS.enc.Hex);
        } else {
            outMd5.innerText = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
            outSha1.innerText = CryptoJS.SHA1(text).toString(CryptoJS.enc.Hex);
            outSha256.innerText = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
            outSha512.innerText = CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
        }
    };

    txtInput.addEventListener('input', updateTextHashes);
    hmacKey.addEventListener('input', updateTextHashes);

    // ==========================================
    // FILE CHECKSUM
    // ==========================================
    const dropzone = container.querySelector('#file-dropzone');
    const fileInput = container.querySelector('#file-input');
    const fileInfo = container.querySelector('#file-info');
    const fileName = container.querySelector('#file-name');
    const fileSize = container.querySelector('#file-size');
    const fileProgress = container.querySelector('#file-progress');
    const fileResults = container.querySelector('#file-results');
    
    const fileMd5Out = container.querySelector('#file-md5-out');
    const fileSha256Out = container.querySelector('#file-sha256-out');

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.background = 'rgba(255,255,255,0.05)';
        dropzone.style.borderColor = 'var(--accent-color)';
    });
    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.style.background = 'rgba(0,0,0,0.1)';
        dropzone.style.borderColor = 'rgba(255,255,255,0.2)';
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.background = 'rgba(0,0,0,0.1)';
        dropzone.style.borderColor = 'rgba(255,255,255,0.2)';
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    const handleFile = (file) => {
        fileResults.style.display = 'none';
        fileInfo.style.display = 'block';
        fileName.innerText = file.name;
        fileSize.innerText = formatBytes(file.size);
        fileProgress.style.display = 'block';

        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            
            // Calculate SHA-256 natively (fast!)
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const sha256Hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Calculate MD5 using CryptoJS (needs WordArray)
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
            const md5Hex = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);

            fileSha256Out.innerText = sha256Hex;
            fileMd5Out.innerText = md5Hex;

            fileProgress.style.display = 'none';
            fileResults.style.display = 'flex';
        };
        reader.readAsArrayBuffer(file);
    };

    // ==========================================
    // BCRYPT
    // ==========================================
    const bcInput = container.querySelector('#bcrypt-input');
    const bcCost = container.querySelector('#bcrypt-cost');
    const bcCostVal = container.querySelector('#bcrypt-cost-val');
    const btnGenBc = container.querySelector('#btn-gen-bcrypt');
    const bcOut = container.querySelector('#bcrypt-out');

    bcCost.addEventListener('input', (e) => {
        bcCostVal.innerText = e.target.value;
    });

    btnGenBc.addEventListener('click', () => {
        const pass = bcInput.value;
        if (!pass) return;
        
        const cost = parseInt(bcCost.value);
        btnGenBc.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Generating...";
        btnGenBc.disabled = true;
        
        // Use setTimeout to allow UI to update before heavy sync task
        setTimeout(() => {
            try {
                const hash = bcrypt.hashSync(pass, cost);
                bcOut.value = hash;
            } catch (e) {
                bcOut.value = "Error: " + e.message;
            }
            btnGenBc.innerHTML = "<i class='bx bx-cog'></i> Generate Bcrypt";
            btnGenBc.disabled = false;
        }, 50);
    });

    const bcVerifyHash = container.querySelector('#bcrypt-verify-hash');
    const bcVerifyPass = container.querySelector('#bcrypt-verify-pass');
    const btnVerifyBc = container.querySelector('#btn-verify-bcrypt');
    const bcVerifyRes = container.querySelector('#bcrypt-verify-result');

    btnVerifyBc.addEventListener('click', () => {
        const hash = bcVerifyHash.value.trim();
        const pass = bcVerifyPass.value;
        if (!hash || !pass) return;

        try {
            const match = bcrypt.compareSync(pass, hash);
            bcVerifyRes.style.display = 'block';
            if (match) {
                bcVerifyRes.style.background = 'rgba(16, 185, 129, 0.1)';
                bcVerifyRes.style.color = '#10b981';
                bcVerifyRes.style.border = '1px solid rgba(16, 185, 129, 0.2)';
                bcVerifyRes.innerHTML = "<i class='bx bx-check-circle'></i> Match! The password is correct.";
            } else {
                bcVerifyRes.style.background = 'rgba(239, 68, 68, 0.1)';
                bcVerifyRes.style.color = '#ef4444';
                bcVerifyRes.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                bcVerifyRes.innerHTML = "<i class='bx bx-x-circle'></i> No match. Incorrect password.";
            }
        } catch(e) {
            bcVerifyRes.style.display = 'block';
            bcVerifyRes.style.background = 'rgba(239, 68, 68, 0.1)';
            bcVerifyRes.style.color = '#ef4444';
            bcVerifyRes.style.border = '1px solid rgba(239, 68, 68, 0.2)';
            bcVerifyRes.innerHTML = "<i class='bx bx-error'></i> Invalid Bcrypt Hash format.";
        }
    });
}
