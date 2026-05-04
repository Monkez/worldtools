const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

// AI Image Providers — require from server/providers (relative path)
const path = require('path');
const pollinations = require(path.join(__dirname, '..', 'server', 'providers', 'pollinations'));
const magnific = require(path.join(__dirname, '..', 'server', 'providers', 'magnific'));

module.exports = async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req;
    // Strip /api/ai/ prefix
    const route = url.replace(/^\/api\/ai\/?/, '').split('?')[0];

    try {
        if (req.method === 'POST' && route === 'test') {
            const { settings } = req.body;
            if (settings.provider === 'custom') {
                if (!settings.customBaseUrl) return res.status(400).json({ success: false, message: "Custom Base URL is required." });
                const openai = new OpenAI({ apiKey: settings.customApiKey || 'dummy-key-for-local', baseURL: settings.customBaseUrl });
                await openai.chat.completions.create({ model: settings.customModelId || 'local-model', messages: [{ role: 'user', content: 'Say OK' }], max_tokens: 5 });
                return res.json({ success: true, message: "Connection OK" });
            }
            const key = settings.geminiKey || process.env.GEMINI_API_KEY;
            if (!key) return res.json({ success: false, message: "API Key is missing." });
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: settings.geminiModelId || "gemini-1.5-flash" });
            await model.generateContent("Say OK");
            return res.json({ success: true, message: "Connection OK" });
        }

        if (req.method === 'POST' && route === 'test-image') {
            const { settings } = req.body;
            const result = await magnific.testConnection(settings.imageKey);
            return res.json(result);
        }

        if (req.method === 'POST' && route === 'test-pollinations') {
            const { settings } = req.body;
            const result = await pollinations.testConnection(settings.pollinationsApiKey);
            return res.json(result);
        }

        if (req.method === 'POST' && route === 'refine-prompt') {
            const { settings, prompt } = req.body;
            const systemInstruction = `You are an AI prompt optimizer for image generation/editing models. Your rules:
1. If the user's prompt is a SPECIFIC EDIT INSTRUCTION (e.g. "change color to blue", "remove background", "add hat"), keep it concise and action-focused. Translate to English if needed, clarify the instruction slightly, but DO NOT add excessive visual details, lighting, camera angles, or style descriptors. Keep it under 2 sentences.
2. If the user's prompt is a CREATIVE/GENERATION prompt (e.g. "a cat in space", "fantasy landscape"), then expand with visual details, style, lighting, and atmosphere to produce a richer image.
3. NEVER add "8k resolution", "sharp focus", "cinematic lighting" or similar filler to simple edit instructions.
4. Return ONLY the rewritten prompt text. No explanations, no quotes.`;

            if (settings.provider === 'custom') {
                const openai = new OpenAI({ apiKey: settings.customApiKey || 'dummy-key-for-local', baseURL: settings.customBaseUrl });
                const stream = await openai.chat.completions.create({
                    model: settings.customModelId || 'local-model',
                    messages: [{ role: 'system', content: systemInstruction }, { role: 'user', content: prompt }]
                });
                return res.json({ success: true, prompt: stream.choices[0].message.content.trim() });
            }
            const key = settings.geminiKey || process.env.GEMINI_API_KEY;
            if (!key) return res.status(400).json({ error: "Gemini API Key is missing." });
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: settings.geminiModelId || "gemini-1.5-flash", systemInstruction });
            const result = await model.generateContent(prompt);
            return res.json({ success: true, prompt: result.response.text().trim() });
        }

        if (req.method === 'POST' && route === 'vision') {
            const { imageBase64, prompt: vPrompt, settings } = req.body;
            if (settings && settings.provider === 'custom') {
                if (!settings.customBaseUrl) return res.status(400).json({ error: "Custom Base URL is required." });
                const openai = new OpenAI({ apiKey: settings.customApiKey || 'dummy-key-for-local', baseURL: settings.customBaseUrl });
                const content = [{ type: 'text', text: vPrompt || "Analyze this image." }];
                if (imageBase64) {
                    const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
                    content.push({ type: 'image_url', image_url: { url: `data:${mimeType};base64,${b64}` } });
                }
                const resp = await openai.chat.completions.create({ model: settings.customModelId || 'local-model', messages: [{ role: 'user', content }], max_tokens: 1000 });
                return res.json({ result: resp.choices[0]?.message?.content || "" });
            }
            const key = (settings && settings.geminiKey) || process.env.GEMINI_API_KEY;
            if (!key) return res.status(400).json({ error: "API Key is missing." });
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: (settings && settings.geminiModelId) || "gemini-1.5-flash" });
            const parts = [{ text: vPrompt || "Analyze this image." }];
            if (imageBase64) {
                const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
                parts.push({ inlineData: { data: b64, mimeType } });
            }
            const result = await model.generateContent(parts);
            return res.json({ result: result.response.text() });
        }

        if (req.method === 'POST' && route === 'generate-image') {
            const { settings, prompt, model = "flux", resolution = "1k", aspect_ratio = "square_1_1", provider = "magnific", width, height } = req.body;
            if (!prompt) return res.status(400).json({ error: "Prompt is required." });
            let imageUrl;
            if (provider === "pollinations") {
                imageUrl = await pollinations.generateImage({ prompt, model, aspect_ratio, width, height, apiKey: settings?.pollinationsApiKey });
            } else {
                imageUrl = await magnific.generateImage({ prompt, model, resolution, aspect_ratio, apiKey: settings?.imageKey });
            }
            return res.json({ success: true, imageUrl });
        }

        if (req.method === 'POST' && route === 'edit-image') {
            const { settings, prompt, image, model = "mystic", provider = "magnific", resolution = "1k", targetW = 1, targetH = 1 } = req.body;
            if (!prompt) return res.status(400).json({ error: "Prompt is required." });
            if (!image) return res.status(400).json({ error: "Image is required for editing." });
            let imageUrl;
            if (provider === 'puter') {
                return res.status(400).json({ error: "Puter AI does not support image-to-image editing." });
            } else if (provider === 'pollinations') {
                imageUrl = await pollinations.editImage({ prompt, image, model, targetW, targetH, apiKey: settings?.pollinationsApiKey });
            } else {
                imageUrl = await magnific.editImage({ prompt, image, model, resolution, targetW, targetH, apiKey: settings?.imageKey });
            }
            return res.json({ success: true, imageUrl });
        }

        if (req.method === 'POST' && route === 'generate-fill') {
            const { settings, prompt, image, mask, targetW = 1, targetH = 1, provider = "magnific", model } = req.body;
            let imageUrl;
            if (provider === 'pollinations') {
                const apiKey = settings?.pollinationsApiKey;
                if (!apiKey) return res.status(400).json({ success: false, message: "Pollinations API Key is required for inpainting." });
                imageUrl = await pollinations.generateFill({ prompt, image, mask, targetW, targetH, apiKey, model: model || "gptimage" });
            } else {
                const apiKey = settings?.imageKey || settings?.geminiKey || process.env.MAGNIFIC_API_KEY || process.env.GEMINI_API_KEY;
                imageUrl = await magnific.generateFill({ prompt, image, mask, targetW, targetH, apiKey });
            }
            return res.json({ success: true, imageUrl });
        }

        if (req.method === 'POST' && route === 'chat') {
            const { settings, prompt, systemInstruction } = req.body;
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            if (settings.provider === 'custom') {
                const openai = new OpenAI({ apiKey: settings.customApiKey || 'dummy-key-for-local', baseURL: settings.customBaseUrl });
                const messages = [];
                if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
                messages.push({ role: 'user', content: prompt });
                const stream = await openai.chat.completions.create({ model: settings.customModelId || 'local-model', messages, stream: true });
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content || '';
                    if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
                }
                res.write('event: done\ndata: {}\n\n');
                return res.end();
            }

            const key = settings.geminiKey || process.env.GEMINI_API_KEY;
            if (!key) { res.write(`event: error\ndata: ${JSON.stringify({ message: "API Key is missing" })}\n\n`); return res.end(); }
            const genAI = new GoogleGenerativeAI(key);
            const modelId = settings.geminiModelId || "gemini-1.5-flash";
            const modelOpts = systemInstruction ? { model: modelId, systemInstruction } : { model: modelId };
            const model = genAI.getGenerativeModel(modelOpts);
            const result = await model.generateContentStream(prompt);
            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
            res.write('event: done\ndata: {}\n\n');
            return res.end();
        }

        return res.status(404).json({ error: 'API endpoint not found: ' + route });
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ error: err.message });
    }
};
