const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const youtubedl = require('youtube-dl-exec');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('outputs')) fs.mkdirSync('outputs');

app.post('/api/convert', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const targetFormat = req.body.format;
    if (!targetFormat) {
        return res.status(400).json({ error: 'Target format not specified' });
    }

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const baseName = path.parse(originalName).name;
    const outputFileName = `${baseName}-converted.${targetFormat}`;
    const outputPath = path.join(__dirname, 'outputs', outputFileName);

    console.log(`Starting conversion: ${originalName} -> ${targetFormat}`);

    ffmpeg(inputPath)
        .toFormat(targetFormat)
        .on('end', () => {
            console.log(`Conversion finished: ${outputFileName}`);
            res.download(outputPath, outputFileName, (err) => {
                // Cleanup
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Error converting file:', err);
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            res.status(500).json({ error: 'Conversion failed: ' + err.message });
        })
        .save(outputPath);
});

app.post('/api/trim', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) return res.status(400).json({ error: 'Missing start or end time' });

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const outputFileName = `${baseName}-trimmed${ext}`;
    const outputPath = path.join(__dirname, 'outputs', outputFileName);

    console.log(`Starting trim: ${originalName} from ${startTime} to ${endTime}`);

    ffmpeg(inputPath)
        .outputOptions([
            `-ss ${startTime}`,
            `-to ${endTime}`,
            '-c copy' // copy codec for blazing fast trim without re-encoding!
        ])
        .on('end', () => {
            console.log(`Trim finished: ${outputFileName}`);
            res.download(outputPath, outputFileName, (err) => {
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Error trimming file:', err);
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            res.status(500).json({ error: 'Trim failed: ' + err.message });
        })
        .save(outputPath);
});

app.post('/api/merge', upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length < 2) {
        return res.status(400).json({ error: 'Please upload at least 2 files to merge' });
    }

    const ext = path.extname(req.files[0].originalname);
    const outputFileName = `merged-media${ext}`;
    const outputPath = path.join(__dirname, 'outputs', outputFileName);
    const listFilePath = path.join(__dirname, 'outputs', `list-${Date.now()}.txt`);

    // Create a concat demuxer file
    // file 'path/to/file1'
    // file 'path/to/file2'
    let listContent = '';
    req.files.forEach(file => {
        // Needs absolute path with forward slashes for ffmpeg on windows
        const safePath = path.resolve(file.path).replace(/\\/g, '/');
        listContent += `file '${safePath}'\n`;
    });
    fs.writeFileSync(listFilePath, listContent);

    console.log(`Starting merge of ${req.files.length} files`);

    ffmpeg()
        .input(listFilePath)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions('-c copy')
        .on('end', () => {
            console.log(`Merge finished: ${outputFileName}`);
            res.download(outputPath, outputFileName, (err) => {
                if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
                req.files.forEach(f => {
                    if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
                });
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Error merging files:', err);
            if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
            req.files.forEach(f => {
                if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
            });
            res.status(500).json({ error: 'Merge failed: ' + err.message });
        })
        .save(outputPath);
});

// =====================================
// YOUTUBE DOWNLOADER ENDPOINTS
// =====================================

app.get('/api/yt/info', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send('Invalid YouTube URL');
        }
        
        const info = await youtubedl(url, { dumpJson: true, jsRuntimes: 'node' });
        
        // Find all available video heights
        const availableHeights = [...new Set(info.formats.map(f => f.height).filter(h => h))].sort((a,b) => b - a);
        
        const frontendFormats = availableHeights.map(h => ({
            itag: `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`,
            qualityLabel: `${h}p`,
            hasVideo: true,
            hasAudio: true,
            container: 'mp4',
            contentLength: null
        }));
        
        frontendFormats.push({
            itag: `bestaudio[ext=m4a]/bestaudio`,
            qualityLabel: 'Audio Only',
            hasVideo: false,
            hasAudio: true,
            container: 'm4a',
            contentLength: null
        });

        res.json({
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
            formats: frontendFormats
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to extract video info.");
    }
});

app.get('/api/yt/download-stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { url, itag } = req.query;
        if (!url || !itag) {
            res.write(`event: error\ndata: Missing URL or Format ID\n\n`);
            return res.end();
        }
        
        res.write(`event: progress\ndata: Fetching video information...\n\n`);
        const info = await youtubedl(url, { dumpJson: true, jsRuntimes: 'node' });
        const safeTitle = info.title.replace(/[^\w\s\u00C0-\u1FFF\u2C00-\uD7FF.-]/g, '').trim();
        const isAudio = itag.includes('bestaudio') && !itag.includes('bestvideo');
        const ext = isAudio ? 'm4a' : 'mkv';
        const filename = `${Date.now()}.${ext}`;
        const outputPath = path.join(__dirname, 'outputs', filename);

        const subprocess = youtubedl.exec(url, {
            format: itag,
            output: outputPath,
            mergeOutputFormat: ext,
            ffmpegLocation: ffmpegInstaller.path,
            jsRuntimes: 'node'
        });
        subprocess.catch(() => {}); // Prevent unhandled promise rejection crash on WinError 32

        let aborted = false;
        req.on('close', () => {
            aborted = true;
            try { subprocess.kill('SIGINT'); } catch(e) {}
        });

        subprocess.stdout.on('data', (data) => {
            if (aborted) return;
            const line = data.toString();
            if (line.includes('[download]') && line.includes('%')) {
                const match = line.match(/\[download\]\s+(.*)/);
                if (match && match[1]) {
                    res.write(`event: progress\ndata: ${match[1].trim()}\n\n`);
                }
            } else if (line.includes('[Merger]')) {
                res.write(`event: progress\ndata: Merging audio and video...\n\n`);
            }
        });

        subprocess.on('close', async (code) => {
            if (aborted) return;
            
            const tempPath = outputPath.replace(`.${ext}`, `.temp.${ext}`);
            let finalDownloadPath = outputPath;
            
            if (!fs.existsSync(outputPath) && fs.existsSync(tempPath)) {
                res.write(`event: progress\ndata: Finalizing file (handling lock)...\n\n`);
                await new Promise(r => setTimeout(r, 1000));
                try {
                    fs.renameSync(tempPath, outputPath);
                } catch (e) {
                    finalDownloadPath = tempPath; // serve temp file directly
                }
            } else if (!fs.existsSync(outputPath)) {
                res.write(`event: error\ndata: Download failed. File not found.\n\n`);
                return res.end();
            }

            res.write(`event: done\ndata: ${JSON.stringify({ filename: path.basename(finalDownloadPath), title: safeTitle + '.' + ext })}\n\n`);
            res.end();
        });

        subprocess.on('error', (err) => {
            if (aborted) return;
            res.write(`event: error\ndata: ${err.message}\n\n`);
            res.end();
        });

    } catch (err) {
        res.write(`event: error\ndata: ${err.message}\n\n`);
        res.end();
    }
});

app.get('/api/yt/get-file', (req, res) => {
    const { filename, title } = req.query;
    if (!filename) return res.status(400).send('Filename missing');
    const outputPath = path.join(__dirname, 'outputs', filename);
    if (!fs.existsSync(outputPath)) return res.status(404).send('File not found');
    
    res.download(outputPath, title || filename, (err) => {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
});

// =====================================
// AI LLM PROXY ENDPOINTS (GEMINI)
// =====================================
app.post('/api/ai/chat', express.json(), async (req, res) => {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { settings, prompt, systemInstruction } = req.body;
        
        if (settings.provider === 'custom') {
            if (!settings.customBaseUrl) {
                res.write(`event: error\ndata: ${JSON.stringify({ message: "Custom Base URL is required." })}\n\n`);
                return res.end();
            }

            const openai = new OpenAI({
                apiKey: settings.customApiKey || 'dummy-key-for-local',
                baseURL: settings.customBaseUrl
            });
            
            const messages = [];
            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }
            messages.push({ role: 'user', content: prompt });
            
            const stream = await openai.chat.completions.create({
                model: settings.customModelId || 'local-model',
                messages: messages,
                stream: true,
            });
            
            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta?.content || '';
                if (text) {
                    res.write(`data: ${JSON.stringify({ text })}\n\n`);
                }
            }
            res.write('event: done\ndata: {}\n\n');
            return res.end();
        }

        // DEFAULT TO GEMINI
        const key = settings.geminiKey || process.env.GEMINI_API_KEY;
        
        if (!key) {
            res.write(`event: error\ndata: ${JSON.stringify({ message: "API Key is missing. Please set it in Settings." })}\n\n`);
            return res.end();
        }

        const genAI = new GoogleGenerativeAI(key);
        const modelOpts = { model: "gemini-1.5-flash" };
        if (systemInstruction) {
            modelOpts.systemInstruction = systemInstruction;
        }
        
        const model = genAI.getGenerativeModel(modelOpts);
        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
        
        res.write('event: done\ndata: {}\n\n');
        res.end();
    } catch (err) {
        console.error('AI Stream Error:', err);
        res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
        res.end();
    }
});

app.post('/api/ai/refine-prompt', express.json(), async (req, res) => {
    try {
        const { settings, prompt } = req.body;
        
        const systemInstruction = `You are an expert AI image generation prompt engineer. Your job is to translate and rewrite the user's prompt (which may be in Vietnamese or simple English) into a highly detailed, descriptive, and optimal English prompt for image generation/editing AI models (like Midjourney, Magnific, Flux). Focus on visual details, lighting, camera angles, style, and atmosphere. DO NOT include conversational text. Return ONLY the rewritten prompt.`;

        if (settings.provider === 'custom') {
            const openai = new OpenAI({
                apiKey: settings.customApiKey || 'dummy-key-for-local',
                baseURL: settings.customBaseUrl
            });
            const stream = await openai.chat.completions.create({
                model: settings.customModelId || 'local-model',
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: prompt }
                ]
            });
            return res.json({ success: true, prompt: stream.choices[0].message.content.trim() });
        }

        // DEFAULT TO GEMINI
        const key = settings.geminiKey || process.env.GEMINI_API_KEY;
        if (!key) return res.status(400).json({ error: "Gemini API Key is missing. Please set it in Global Settings." });

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ success: true, prompt: text.trim() });
    } catch (err) {
        console.error('Refine Prompt Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/ai/vision', express.json({limit: '50mb'}), async (req, res) => {
    try {
        const { imageBase64, prompt, settings } = req.body;
        
        if (settings && settings.provider === 'custom') {
            if (!settings.customBaseUrl) return res.status(400).json({ error: "Custom Base URL is required." });
            const openai = new OpenAI({
                apiKey: settings.customApiKey || 'dummy-key-for-local',
                baseURL: settings.customBaseUrl
            });
            const content = [{ type: 'text', text: prompt || "Phân tích ảnh này." }];
            if (imageBase64) {
                const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
                content.push({
                    type: 'image_url',
                    image_url: { url: `data:${mimeType};base64,${b64}` }
                });
            }
            const resp = await openai.chat.completions.create({
                model: settings.customModelId || 'local-model',
                messages: [{ role: 'user', content }],
                max_tokens: 1000
            });
            return res.json({ result: resp.choices[0]?.message?.content || "" });
        }

        const key = (settings && settings.geminiKey) || process.env.GEMINI_API_KEY;
        if (!key) return res.status(400).json({ error: "API Key is missing." });
        
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const parts = [ { text: prompt || "Phân tích ảnh này." } ];
        
        if (imageBase64) {
            const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
            parts.push({
                inlineData: {
                    data: b64,
                    mimeType: mimeType
                }
            });
        }
        
        const result = await model.generateContent(parts);
        res.json({ result: result.response.text() });
    } catch (err) {
        console.error('Vision API Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/ai/test', express.json(), async (req, res) => {
    try {
        const { settings } = req.body;
        
        if (settings.provider === 'custom') {
            if (!settings.customBaseUrl) return res.status(400).json({ success: false, message: "Custom Base URL is required." });
            const openai = new OpenAI({
                apiKey: settings.customApiKey || 'dummy-key-for-local',
                baseURL: settings.customBaseUrl
            });
            await openai.chat.completions.create({
                model: settings.customModelId || 'local-model',
                messages: [{ role: 'user', content: 'Say OK' }],
                max_tokens: 5
            });
            return res.json({ success: true, message: "Connection OK" });
        }

        // GEMINI
        const key = settings.geminiKey || process.env.GEMINI_API_KEY;
        if (!key) return res.json({ success: false, message: "API Key is missing." });
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model.generateContent("Say OK");
        return res.json({ success: true, message: "Connection OK" });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

const PORT = 3000;

app.post('/api/ai/test-image', express.json(), async (req, res) => {
    try {
        const { settings } = req.body;
        const key = settings.imageKey;
        if (!key) return res.json({ success: false, message: "Magnific API Key is missing." });
        
        // Simple test request to get the list of tasks (or just any endpoint to test auth)
        const response = await fetch('https://api.magnific.com/v1/ai/image-to-prompt', {
            method: 'GET',
            headers: {
                'x-magnific-api-key': key
            }
        });
        
        const data = await response.json();
        if (!response.ok) {
            // Magnific returns 404 "Task not found" if auth succeeds but no tasks exist
            if (response.status === 404 && data.message === 'Task not found') {
                return res.json({ success: true, message: "Connection OK" });
            }
            return res.json({ success: false, message: data.message || data.error || 'Invalid API Key' });
        }
        
        return res.json({ success: true, message: "Connection OK" });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

app.post('/api/ai/generate-image', express.json(), async (req, res) => {
    try {
        const { settings, prompt, model = "mystic", resolution = "1k", aspect_ratio = "square_1_1" } = req.body;
        const key = settings && settings.imageKey;
        if (!key) return res.status(400).json({ error: "Magnific API Key is missing. Please configure it in Settings." });
        if (!prompt) return res.status(400).json({ error: "Prompt is required." });
        
        // Map model to correct URL
        let apiUrl = 'https://api.magnific.com/v1/ai/mystic';
        let bodyPayload = { prompt, resolution, aspect_ratio, engine: "automatic" };
        
        if (model !== 'mystic') {
            apiUrl = `https://api.magnific.com/v1/ai/text-to-image/${model}`;
            bodyPayload = { prompt, aspect_ratio }; // Other models might not support resolution
        } else {
            // For mystic, we can keep the default fluid model
            bodyPayload.model = "fluid";
        }

        // 1. Create Task
        const createRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-magnific-api-key': key
            },
            body: JSON.stringify(bodyPayload)
        });
        
        const createDataText = await createRes.text();
        let createData;
        try { createData = JSON.parse(createDataText); } catch(e) { throw new Error(`Magnific HTML Error: ${createRes.status} ${createDataText.substring(0, 100)}`); }
        if (!createRes.ok) throw new Error(`Magnific API Error: ${createDataText}`);
        
        const taskId = createData.data.task_id;
        
        // 2. Poll Task
        while (true) {
            await new Promise(r => setTimeout(r, 3000));
            const getRes = await fetch(`${apiUrl}/${taskId}`, {
                headers: { 'x-magnific-api-key': key }
            });
            const getData = await getRes.json();
            
            if (getData.data.status === 'COMPLETED') {
                const generatedImage = getData.data.generated && getData.data.generated[0] ? getData.data.generated[0].url || getData.data.generated[0] : null;
                if (!generatedImage) throw new Error("Magnific returned COMPLETED but no image URL found.");
                return res.json({ success: true, imageUrl: generatedImage });
            } else if (getData.data.status === 'FAILED') {
                throw new Error('Magnific Image Generation failed.');
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/ai/edit-image', express.json({ limit: '50mb' }), async (req, res) => {
    try {
        const { settings, prompt, image, model = "mystic", resolution = "1k" } = req.body;
        const key = settings && settings.imageKey;
        if (!key) return res.status(400).json({ error: "Magnific API Key is missing. Please configure it in Settings." });
        if (!prompt) return res.status(400).json({ error: "Prompt is required." });
        if (!image) return res.status(400).json({ error: "Image is required for editing." });
        
        let apiUrl = 'https://api.magnific.com/v1/ai/mystic';
        // Base64 clean up if needed
        const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
        
        let bodyPayload = {};
        let pollUrl = apiUrl;
        
        if (model === 'mystic') {
            apiUrl = 'https://api.magnific.com/v1/ai/mystic';
            pollUrl = apiUrl;
            // For mystic, we CANNOT pass model (like fluid) if we pass structure_reference!
            bodyPayload = { 
                prompt: prompt, 
                resolution: resolution,
                structure_reference: base64Image,
                structure_strength: 50,
                engine: "automatic"
            };
        } else if (model === 'upscaler') {
            apiUrl = 'https://api.magnific.com/v1/ai/image-upscaler-creative';
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image };
        } else if (model === 'relight') {
            apiUrl = 'https://api.magnific.com/v1/ai/image-relight';
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image };
        } else if (model === 'style-transfer') {
            apiUrl = 'https://api.magnific.com/v1/ai/image-styletransfer';
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image };
        } else if (model === 'remove-background') {
            apiUrl = 'https://api.magnific.com/v1/ai/remove-background';
            pollUrl = apiUrl;
            bodyPayload = { image: base64Image };
        } else if (model === 'super-resolution') {
            const { scale_factor } = req.body;
            apiUrl = 'https://api.magnific.com/v1/ai/image-upscaler-precision-v2';
            pollUrl = apiUrl;
            bodyPayload = { 
                image: base64Image,
                sharpen: 7,
                smart_grain: 7,
                ultra_detail: 30,
                flavor: "sublime",
                scale_factor: scale_factor || 4,
                filter_nsfw: false
            };
        } else if (model === 'reimagine-flux') {
            apiUrl = 'https://api.magnific.com/v1/ai/image-editing/reimagine-flux';
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image };
        } else if (model === 'image-expand') {
            apiUrl = 'https://api.magnific.com/v1/ai/image-expand';
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image };
        } else if (model === 'inpainting') {
            apiUrl = 'https://api.magnific.com/v1/ai/ideogram-image-edit';
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image, magic_prompt: "AUTO", rendering_speed: "DEFAULT" };
        } else {
            // Fallback for others (Skin Enhancer, Change Camera)
            apiUrl = `https://api.magnific.com/v1/ai/image-editing/${model}`;
            pollUrl = apiUrl;
            bodyPayload = { prompt, image: base64Image };
        }

        // 1. Create Task
        const createRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-magnific-api-key': key
            },
            body: JSON.stringify(bodyPayload)
        });
        
        const createDataText = await createRes.text();
        let createData;
        try { createData = JSON.parse(createDataText); } catch(e) { throw new Error(`Magnific HTML Error: ${createRes.status} ${createDataText.substring(0, 100)}`); }
        if (!createRes.ok) throw new Error(`Magnific API Error: ${createDataText}`);
        
        const taskId = createData.data.task_id;
        
        // 2. Poll Task
        while (true) {
            await new Promise(r => setTimeout(r, 3000));
            const getRes = await fetch(`${pollUrl}/${taskId}`, {
                headers: { 'x-magnific-api-key': key }
            });
            const getData = await getRes.json();
            
            if (getData.data.status === 'COMPLETED') {
                // Background removal might return different fields or the same generated array
                const generatedImage = getData.data.generated && getData.data.generated[0] ? getData.data.generated[0].url || getData.data.generated[0] : (getData.data.output_image || null);
                if (!generatedImage) throw new Error("Magnific returned COMPLETED but no image URL found.");
                return res.json({ success: true, imageUrl: generatedImage });
            } else if (getData.data.status === 'FAILED') {
                throw new Error('Magnific Image Generation failed.');
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/ai/generate-fill', express.json({limit: '50mb'}), async (req, res) => {
    try {
        const { settings, prompt, image, mask } = req.body;
        
        // Fallback to imageKey or geminiKey as they might be stored in settings
        const key = settings?.imageKey || settings?.geminiKey || process.env.MAGNIFIC_API_KEY || process.env.GEMINI_API_KEY;
        
        if (!key) return res.status(400).json({ success: false, message: "Magnific API Key is missing. Please set it in Settings." });
        if (!image || !mask) return res.status(400).json({ success: false, message: "Image and mask are required." });

        const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
        const base64Mask = mask.replace(/^data:image\/\w+;base64,/, '');

        // Using Magnific Inpainting API
        const apiUrl = 'https://api.magnific.com/v1/ai/ideogram-image-edit'; 

        const bodyPayload = {
            image: base64Image,
            mask: base64Mask,
            prompt: prompt || "", // If prompt is empty, it acts as object removal
            magic_prompt: "AUTO",
            rendering_speed: "DEFAULT"
        };

        const createRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-magnific-api-key': key
            },
            body: JSON.stringify(bodyPayload)
        });
        
        const createDataText = await createRes.text();
        let createData;
        try { createData = JSON.parse(createDataText); } catch(e) { throw new Error(`Magnific HTML Error: ${createRes.status} ${createDataText.substring(0, 100)}`); }
        if (!createRes.ok) throw new Error(`Magnific API Error: ${createDataText}`);
        
        const taskId = createData.data.task_id;
        
        // Poll Task
        while (true) {
            await new Promise(r => setTimeout(r, 3000));
            const getRes = await fetch(`${apiUrl}/${taskId}`, {
                headers: { 'x-magnific-api-key': key }
            });
            const getData = await getRes.json();
            
            if (getData.data.status === 'COMPLETED') {
                const generatedImage = getData.data.generated && getData.data.generated[0] ? getData.data.generated[0].url || getData.data.generated[0] : (getData.data.output_image || null);
                if (!generatedImage) throw new Error("Magnific returned COMPLETED but no image URL found.");
                return res.json({ success: true, imageUrl: generatedImage });
            } else if (getData.data.status === 'FAILED') {
                const errDetail = getData.data.error || getData.data.error_message || getData.error || JSON.stringify(getData.data);
                throw new Error("Magnific task failed: " + errDetail);
            }
        }
    } catch (err) {
        console.error('Magnific Inpainting Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});
// Serve the compiled frontend (for production/Electron)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.use((req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});
app.listen(PORT, '127.0.0.1', () => {
    console.log(`WorldTools Backend is running on http://localhost:${PORT}`);
    if (process.send) process.send('server-ready'); // Notify Electron main process
});
