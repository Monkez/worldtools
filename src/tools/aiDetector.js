import mammoth from 'mammoth';
import { AIClient } from '../utils/aiClient.js';

export function renderAiDetector(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1200px; margin: 0 auto; padding: 24px; display: flex; gap: 24px; flex-wrap: wrap;">
            
            <!-- LEFT COLUMN: INPUT -->
            <div style="flex: 1; min-width: 350px; display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #fff; display: flex; align-items: center; gap: 8px;"><i class='bx bx-text'></i> Content to Analyze</h3>
                    <button class="btn-secondary" id="btn-upload" title="Upload File (.txt, .md, .docx)" style="padding: 8px 12px; font-size: 13px; display: flex; align-items: center; gap: 6px;"><i class='bx bx-upload'></i> Upload File</button>
                    <input type="file" id="file-input" accept=".txt,.md,.docx" style="display: none;">
                </div>
                
                <textarea id="ai-input" class="input-field" style="flex: 1; min-height: 400px; resize: none; font-size: 15px; line-height: 1.6; padding: 16px;" placeholder="Paste an article, essay, or email here... Or upload a document. Minimum 50 words recommended for accurate analysis."></textarea>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div id="word-count" style="font-size: 12px; color: var(--text-secondary); font-weight: 500;">0 words</div>
                    <button id="btn-analyze" class="btn-primary" style="background: linear-gradient(45deg, #a855f7, #6366f1); padding: 12px 32px; border: none; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; color: white; display: flex; align-items: center; gap: 8px; transition: 0.2s;"><i class='bx bx-search-alt-2'></i> Analyze Content</button>
                </div>
            </div>

            <!-- RIGHT COLUMN: RESULTS -->
            <div style="flex: 1; min-width: 350px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; flex-direction: column;">
                <h3 style="margin: 0 0 24px 0; color: #fff; display: flex; align-items: center; gap: 8px;"><i class='bx bx-radar'></i> Analysis Report</h3>
                
                <!-- Empty State -->
                <div id="res-empty" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary); text-align: center; opacity: 0.7;">
                    <i class='bx bx-bot' style="font-size: 64px; margin-bottom: 16px;"></i>
                    <p style="margin: 0; font-size: 15px;">Paste text and click Analyze to detect AI-generated content.</p>
                </div>

                <!-- Loading State -->
                <div id="res-loading" style="display: none; flex: 1; flex-direction: column; align-items: center; justify-content: center; color: var(--accent-color);">
                    <i class='bx bx-loader-alt bx-spin' style="font-size: 48px; margin-bottom: 16px;"></i>
                    <h4 style="margin: 0; color: #fff;">Detecting patterns...</h4>
                    <p id="loading-status" style="margin: 8px 0 0 0; font-size: 13px; color: var(--text-secondary);">Analyzing perplexity and burstiness...</p>
                </div>

                <!-- Error State -->
                <div id="res-error" style="display: none; padding: 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #ef4444; font-size: 14px;">
                </div>

                <!-- Result State -->
                <div id="res-data" style="display: none; flex-direction: column; gap: 24px;">
                    
                    <!-- Overall Score -->
                    <div style="display: flex; align-items: center; gap: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div style="position: relative; width: 100px; height: 100px;">
                            <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"></path>
                                <path id="score-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="100, 100" style="transition: stroke-dasharray 1s ease-out;"></path>
                            </svg>
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                <span id="score-text" style="font-size: 24px; font-weight: bold; color: #fff;">0%</span>
                                <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">AI Prob.</span>
                            </div>
                        </div>
                        <div style="flex: 1;">
                            <h2 id="verdict-title" style="margin: 0 0 8px 0; font-size: 22px;">Highly Likely AI</h2>
                            <p id="verdict-desc" style="margin: 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5;"></p>
                        </div>
                    </div>

                    <!-- Criteria Grid -->
                    <div id="criteria-grid" style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                        <!-- Injected dynamically -->
                    </div>

                    <!-- Highlighted Signs -->
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 16px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Key Indicators</h4>
                        <ul id="signs-list" style="margin: 0; padding-left: 16px; font-size: 13px; color: #fff; line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
                        </ul>
                    </div>

                </div>
            </div>
        </div>
        <style>
            .crit-card {
                background: rgba(255,255,255,0.02);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .crit-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .crit-name {
                font-weight: 600;
                font-size: 14px;
                color: #fff;
            }
            .crit-badge {
                font-size: 11px;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: bold;
            }
            .crit-notes {
                font-size: 13px;
                color: var(--text-secondary);
                line-height: 1.4;
            }
            .btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        </style>
    `;

    const inputArea = container.querySelector('#ai-input');
    const wordCount = container.querySelector('#word-count');
    const btnUpload = container.querySelector('#btn-upload');
    const fileInput = container.querySelector('#file-input');
    const btnAnalyze = container.querySelector('#btn-analyze');

    const resEmpty = container.querySelector('#res-empty');
    const resLoading = container.querySelector('#res-loading');
    const resError = container.querySelector('#res-error');
    const resData = container.querySelector('#res-data');

    // Live word count
    inputArea.addEventListener('input', () => {
        const words = inputArea.value.trim().split(/\\s+/).filter(w => w.length > 0).length;
        wordCount.innerText = `${words} word${words !== 1 ? 's' : ''}`;
    });

    // File Upload Handler
    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        btnUpload.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Reading...";
        try {
            if (file.name.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                inputArea.value = result.value;
            } else {
                const text = await file.text();
                inputArea.value = text;
            }
            inputArea.dispatchEvent(new Event('input')); // trigger word count
        } catch (err) {
            alert('Failed to read file: ' + err.message);
        }
        btnUpload.innerHTML = "<i class='bx bx-upload'></i> Upload File";
        fileInput.value = ''; // reset
    });

    // AI Analysis
    btnAnalyze.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) {
            inputArea.focus();
            return;
        }

        // Setup UI
        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Analyzing...";
        resEmpty.style.display = 'none';
        resError.style.display = 'none';
        resData.style.display = 'none';
        resLoading.style.display = 'flex';

        const statusMsgs = ["Analyzing perplexity...", "Evaluating burstiness...", "Checking stylistic patterns...", "Finalizing verdict..."];
        let msgIdx = 0;
        const statusEl = container.querySelector('#loading-status');
        const interval = setInterval(() => {
            msgIdx = (msgIdx + 1) % statusMsgs.length;
            statusEl.innerText = statusMsgs[msgIdx];
        }, 1500);

        const prompt = `You are an expert AI Content Detector. 
Analyze the following text and determine the likelihood that it was generated by an AI (like ChatGPT, Claude, etc.).
Evaluate using standard linguistic markers: Perplexity (predictability of words), Burstiness (variation in sentence length/structure), and Tone (robotic vs human nuance).

CRITICAL INSTRUCTION: You MUST return the result in the EXACT SAME LANGUAGE as the text you are analyzing. If the text is Vietnamese, all your output values MUST be in Vietnamese. If it's English, use English.

Return the result STRICTLY as a valid JSON object with the following exact structure:
{
    "overallScore": <number between 0-100, where 100 means definitely AI>,
    "verdictTitle": "<A short bold title like 'Highly Likely AI', 'Likely Human', 'Mixed Content' - translated to the input language>",
    "verdictDesc": "<A 1-2 sentence detailed summary of your finding - translated to the input language>",
    "criteria": [
        { "name": "<Perplexity / Vocabulary Complexity>", "score": <0-100>, "notes": "<Why did it get this score?>" },
        { "name": "<Burstiness / Sentence Variation>", "score": <0-100>, "notes": "<Why did it get this score?>" },
        { "name": "<Tone & Style Nuance>", "score": <0-100>, "notes": "<Why did it get this score?>" }
    ],
    "highlightedSigns": [
        "<sign 1>",
        "<sign 2>"
    ]
}

Text to analyze:
"""
${text.substring(0, 5000)}
"""`;

        let fullResponse = '';

        try {
            await AIClient.streamChat(
                prompt,
                { systemInstruction: "You are an advanced AI content detection tool. You always output valid, parseable JSON." },
                (chunk) => { fullResponse += chunk; },
                (err) => { throw err; },
                () => {
                    clearInterval(interval);
                    renderResult(fullResponse);
                }
            );
        } catch (err) {
            clearInterval(interval);
            resLoading.style.display = 'none';
            resError.style.display = 'block';
            resError.innerText = "Error: " + err.message + "\\n\\nMake sure your API key is configured correctly in Settings.";
            btnAnalyze.disabled = false;
            btnAnalyze.innerHTML = "<i class='bx bx-search-alt-2'></i> Analyze Content";
        }
    });

    function extractJSON(text) {
        const match = text.match(/```(?:json)?\\n([\\s\\S]*?)\\n```/);
        if (match) return JSON.parse(match[1]);
        
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            return JSON.parse(text.substring(start, end + 1));
        }
        throw new Error("Could not parse JSON from AI response.");
    }

    function renderResult(rawText) {
        btnAnalyze.disabled = false;
        btnAnalyze.innerHTML = "<i class='bx bx-search-alt-2'></i> Analyze Content";
        resLoading.style.display = 'none';

        try {
            const data = extractJSON(rawText);
            
            // Overall
            const score = data.overallScore || 0;
            const circle = container.querySelector('#score-circle');
            const scoreText = container.querySelector('#score-text');
            const title = container.querySelector('#verdict-title');
            const desc = container.querySelector('#verdict-desc');

            scoreText.innerText = score + '%';
            // Update dasharray. Total length is 100.
            circle.style.strokeDasharray = score + ", 100";
            
            let color = '#10b981'; // Green (Human)
            if (score > 40) color = '#f59e0b'; // Yellow
            if (score > 70) color = '#ef4444'; // Red (AI)
            
            circle.setAttribute('stroke', color);
            scoreText.style.color = color;
            title.style.color = color;
            
            title.innerText = data.verdictTitle || "Result";
            desc.innerText = data.verdictDesc || "";

            // Criteria
            const grid = container.querySelector('#criteria-grid');
            grid.innerHTML = '';
            (data.criteria || []).forEach(c => {
                let badgeColor = 'rgba(16, 185, 129, 0.2)';
                let badgeTextColor = '#10b981';
                let badgeText = 'Human-like';
                
                if (c.score > 40) { badgeColor = 'rgba(245, 158, 11, 0.2)'; badgeTextColor = '#f59e0b'; badgeText = 'Mixed'; }
                if (c.score > 70) { badgeColor = 'rgba(239, 68, 68, 0.2)'; badgeTextColor = '#ef4444'; badgeText = 'AI-like'; }

                grid.innerHTML += 
                    '<div class="crit-card">' +
                        '<div class="crit-header">' +
                            '<span class="crit-name">' + c.name + '</span>' +
                            '<span class="crit-badge" style="background: ' + badgeColor + '; color: ' + badgeTextColor + ';">' + badgeText + ' (' + c.score + '%)</span>' +
                        '</div>' +
                        '<div class="crit-notes">' + c.notes + '</div>' +
                    '</div>';
            });

            // Signs
            const ul = container.querySelector('#signs-list');
            ul.innerHTML = '';
            (data.highlightedSigns || []).forEach(s => {
                ul.innerHTML += '<li>' + s + '</li>';
            });

            resData.style.display = 'flex';
        } catch (err) {
            console.error("AI output was:", rawText);
            resError.style.display = 'block';
            resError.innerText = "Error parsing AI response. The model did not return a valid format. Try again.";
        }
    }
}
