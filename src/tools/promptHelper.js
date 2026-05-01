import { AIClient } from '../utils/aiClient.js';

export function renderPromptHelper(container) {
    container.innerHTML = `
        <div class="panel" style="max-width: 1200px; margin: 0 auto; padding: 24px; display: flex; gap: 24px; flex-wrap: wrap;">
            
            <!-- LEFT COLUMN: INPUT -->
            <div style="flex: 1; min-width: 350px; display: flex; flex-direction: column; gap: 16px;">
                <h3 style="margin: 0; color: #fff; display: flex; align-items: center; gap: 8px;"><i class='bx bx-message-square-edit'></i> Prompt Engineering</h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.5;">Describe your basic idea. The AI will generate 5 professional, highly optimized prompts for you to use. Any missing details will be left as &lt;placeholders&gt;.</p>

                <div class="form-group" style="margin-bottom: 0;">
                    <label>Target AI Type</label>
                    <select id="ph-type" class="input-field" style="padding: 10px; font-size: 14px;">
                        <option value="Text/Chat (e.g., ChatGPT, Claude, Gemini)">Text/Chat (ChatGPT, Claude, Gemini)</option>
                        <option value="Image Generation (e.g., Midjourney, DALL-E, Stable Diffusion)">Image Generation (Midjourney, DALL-E)</option>
                        <option value="Coding (e.g., GitHub Copilot, Cursor, Codeium)">Coding (Copilot, Cursor)</option>
                    </select>
                </div>
                
                <textarea id="ph-input" class="input-field" style="flex: 1; min-height: 250px; resize: none; font-size: 15px; line-height: 1.6; padding: 16px;" placeholder="Type your basic idea here...&#10;&#10;Example: I want a picture of a cat in space.&#10;Or: Write an email to my boss asking for a raise."></textarea>
                
                <button id="btn-generate" class="btn-primary" style="background: linear-gradient(45deg, #f59e0b, #ef4444); padding: 14px; border: none; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;"><i class='bx bx-bulb'></i> Enhance Prompt</button>
            </div>

            <!-- RIGHT COLUMN: RESULTS -->
            <div style="flex: 1.5; min-width: 400px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; flex-direction: column;">
                <h3 style="margin: 0 0 24px 0; color: #fff; display: flex; align-items: center; gap: 8px;"><i class='bx bx-list-ul'></i> 5 Optimized Variations</h3>
                
                <!-- Empty State -->
                <div id="ph-empty" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary); text-align: center; opacity: 0.7;">
                    <i class='bx bx-bulb' style="font-size: 64px; margin-bottom: 16px;"></i>
                    <p style="margin: 0; font-size: 15px;">Enter your idea and click Enhance Prompt.</p>
                </div>

                <!-- Loading State -->
                <div id="ph-loading" style="display: none; flex: 1; flex-direction: column; align-items: center; justify-content: center; color: #f59e0b;">
                    <i class='bx bx-loader-alt bx-spin' style="font-size: 48px; margin-bottom: 16px;"></i>
                    <h4 style="margin: 0; color: #fff;">Crafting prompts...</h4>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--text-secondary);">Applying prompt engineering best practices...</p>
                </div>

                <!-- Error State -->
                <div id="ph-error" style="display: none; padding: 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #ef4444; font-size: 14px;">
                </div>

                <!-- Result State -->
                <div id="ph-results" style="display: none; flex-direction: column; gap: 16px; overflow-y: auto; padding-right: 8px;" class="custom-scroll">
                    <!-- Cards injected here -->
                </div>
            </div>
        </div>
        <style>
            .prompt-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .prompt-card:hover {
                border-color: rgba(255,255,255,0.15);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .prompt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .prompt-title {
                font-weight: 600;
                font-size: 15px;
                color: #f59e0b;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .prompt-content {
                font-size: 14px;
                color: #fff;
                line-height: 1.6;
                white-space: pre-wrap;
                font-family: monospace;
                background: rgba(0,0,0,0.3);
                padding: 12px;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.02);
            }
            .prompt-placeholder {
                color: #38bdf8;
                font-weight: bold;
                background: rgba(56, 189, 248, 0.1);
                padding: 0 4px;
                border-radius: 4px;
            }
        </style>
    `;

    const inputArea = container.querySelector('#ph-input');
    const aiTypeSelect = container.querySelector('#ph-type');
    const btnGenerate = container.querySelector('#btn-generate');

    const resEmpty = container.querySelector('#ph-empty');
    const resLoading = container.querySelector('#ph-loading');
    const resError = container.querySelector('#ph-error');
    const resContainer = container.querySelector('#ph-results');

    btnGenerate.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) {
            inputArea.focus();
            return;
        }

        const aiType = aiTypeSelect.value;

        // Setup UI
        btnGenerate.disabled = true;
        btnGenerate.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Generating...";
        resEmpty.style.display = 'none';
        resError.style.display = 'none';
        resContainer.style.display = 'none';
        resLoading.style.display = 'flex';

        const prompt = `You are a world-class Prompt Engineer. 
The user wants to write a prompt for a ${aiType} AI model.
Their initial raw idea is: "${text}"

Generate EXACTLY 5 distinct, highly-optimized, professional prompt variations based on their idea. 
Each variation should cater to a slightly different use-case, tone, or style. 
Follow best practices for that specific AI type:
- For Images: Include lighting, camera angles, rendering engine, mood, style, artist references.
- For Text/Chat: Use Persona adoption, explicit constraints, output formats, context, and clear instructions.
- For Code: Specify language, framework, architectural patterns, handling edge cases, and documentation.

CRITICAL INSTRUCTION 1: Any specific details that the user needs to fill in manually later MUST be enclosed in < > (e.g. <Topic>, <Target Audience>, <Subject Color>).
CRITICAL INSTRUCTION 2: You MUST return the result in the EXACT SAME LANGUAGE as the user's initial raw idea. If their idea is in Vietnamese, all titles and prompt contents MUST be in Vietnamese.

Return the result STRICTLY as a valid JSON object with the following exact structure:
{
    "prompts": [
        {
            "title": "<A short title describing the style/approach, e.g. 'Highly Detailed Cinematic' or 'Direct & Professional'>",
            "content": "<The full optimized prompt string>"
        }
    ]
}`;

        let fullResponse = '';

        try {
            await AIClient.streamChat(
                prompt,
                { systemInstruction: "You are an advanced Prompt Generator tool. You always output valid JSON." },
                (chunk) => { fullResponse += chunk; },
                (err) => { throw err; },
                () => {
                    renderResult(fullResponse);
                }
            );
        } catch (err) {
            resLoading.style.display = 'none';
            resError.style.display = 'block';
            resError.innerText = "Error: " + err.message;
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = "<i class='bx bx-bulb'></i> Enhance Prompt";
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

    function highlightPlaceholders(text) {
        // Escapes HTML tags to prevent XSS, but wraps <something> in a span
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                   .replace(/&lt;(.*?)&gt;/g, '<span class="prompt-placeholder">&lt;$1&gt;</span>');
    }

    function renderResult(rawText) {
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = "<i class='bx bx-bulb'></i> Enhance Prompt";
        resLoading.style.display = 'none';

        try {
            const data = extractJSON(rawText);
            const prompts = data.prompts || [];

            resContainer.innerHTML = '';
            
            prompts.forEach((p, idx) => {
                const cardId = 'ph-copy-' + idx;
                const htmlContent = highlightPlaceholders(p.content);
                
                const card = document.createElement('div');
                card.className = 'prompt-card';
                card.innerHTML = 
                    '<div class="prompt-header">' +
                        '<span class="prompt-title"><i class="bx bx-check-circle"></i> ' + p.title + '</span>' +
                        '<button class="btn-secondary cp-btn" data-content="" id="' + cardId + '"><i class="bx bx-copy"></i> Copy</button>' +
                    '</div>' +
                    '<div class="prompt-content">' + htmlContent + '</div>';
                
                // We set data-content safely to the original un-escaped text
                card.querySelector('.cp-btn').setAttribute('data-content', p.content);
                
                resContainer.appendChild(card);
            });

            // Bind copy events
            resContainer.querySelectorAll('.cp-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const content = btn.getAttribute('data-content');
                    navigator.clipboard.writeText(content);
                    
                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = "<i class='bx bx-check'></i> Copied";
                    btn.classList.add('btn-primary');
                    btn.classList.remove('btn-secondary');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-secondary');
                    }, 1500);
                });
            });

            resContainer.style.display = 'flex';
        } catch (err) {
            console.error("AI output was:", rawText);
            resError.style.display = 'block';
            resError.innerText = "Error parsing AI response. Try again.";
        }
    }
}
