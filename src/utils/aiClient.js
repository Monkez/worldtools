export class AIClient {
    static getSettings() {
        return {
            provider: localStorage.getItem('worldtools_ai_provider') || 'gemini',
            geminiKey: localStorage.getItem('worldtools_gemini_key') || '',
            customBaseUrl: localStorage.getItem('worldtools_custom_url') || '',
            customModelId: localStorage.getItem('worldtools_custom_model') || '',
            customApiKey: localStorage.getItem('worldtools_custom_key') || '',
            imageKey: localStorage.getItem('worldtools_image_key') || ''
        };
    }

    static setSettings(settings) {
        localStorage.setItem('worldtools_ai_provider', settings.provider);
        localStorage.setItem('worldtools_gemini_key', settings.geminiKey);
        localStorage.setItem('worldtools_custom_url', settings.customBaseUrl);
        localStorage.setItem('worldtools_custom_model', settings.customModelId);
        localStorage.setItem('worldtools_custom_key', settings.customApiKey);
        if (settings.imageKey !== undefined) localStorage.setItem('worldtools_image_key', settings.imageKey);
    }

    static async testConnection(settings) {
        const response = await fetch('http://localhost:3000/api/ai/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Connection failed');
        }
        return true;
    }

    static async testImageConnection(settings) {
        const response = await fetch('http://localhost:3000/api/ai/test-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Image Connection failed');
        }
        return true;
    }

    /**
     * Stream a response from the AI
     * @param {string} prompt The user prompt
     * @param {Object} options Optional settings { systemInstruction }
     * @param {Function} onChunk Callback when a chunk of text arrives
     * @param {Function} onError Callback when an error occurs
     * @param {Function} onDone Callback when the stream finishes
     */
    static async streamChat(prompt, options = {}, onChunk, onError, onDone) {
        try {
            const settings = this.getSettings();
            
            const response = await fetch('http://localhost:3000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings,
                    prompt,
                    systemInstruction: options.systemInstruction
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                
                // Keep the last incomplete line in the buffer
                buffer = lines.pop();

                let currentEvent = 'message';

                for (const line of lines) {
                    if (line.trim() === '') continue;

                    if (line.startsWith('event: ')) {
                        currentEvent = line.substring(7).trim();
                        continue;
                    }

                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6).trim();
                        try {
                            const data = JSON.parse(dataStr);
                            if (currentEvent === 'error') {
                                onError(new Error(data.message));
                                return;
                            }
                            if (currentEvent === 'done') {
                                if (onDone) onDone();
                                return;
                            }
                            if (data.text) {
                                onChunk(data.text);
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE data:', dataStr);
                        }
                    }
                }
            }
            if (onDone) onDone();
        } catch (err) {
            if (onError) onError(err);
        }
    }
}
