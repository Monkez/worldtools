/**
 * Magnific AI Provider
 * Handles image generation, editing, and inpainting via Magnific API.
 * 
 * Endpoints:
 * - POST /v1/ai/mystic                        → Mystic model (text-to-image + reference editing)
 * - POST /v1/ai/text-to-image/{model}          → Other models (reimagine-flux, nano-banana-pro)
 * - GET  /v1/ai/mystic/{taskId}                → Poll task status
 * - GET  /v1/ai/text-to-image/{model}/{taskId} → Poll task status
 */

const { calcAspectStr, ensureDataUrl } = require('./utils');

/**
 * Test Magnific API key validity
 */
async function testConnection(apiKey) {
    if (!apiKey) {
        return { success: false, message: "Magnific API Key is missing." };
    }

    const response = await fetch('https://api.magnific.com/v1/ai/image-to-prompt', {
        method: 'GET',
        headers: { 'x-magnific-api-key': apiKey }
    });

    const data = await response.json();

    if (!response.ok) {
        // Magnific returns 404 "Task not found" if auth succeeds but no tasks exist
        if (response.status === 404 && data.message === 'Task not found') {
            return { success: true, message: "Connection OK" };
        }
        return { success: false, message: data.message || data.error || 'Invalid API Key' };
    }

    return { success: true, message: "Connection OK" };
}

// ── Internal: create task and poll until completion ──────────────────────────

async function _createAndPollTask(apiUrl, bodyPayload, apiKey) {
    // 1. Create Task
    const createRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-magnific-api-key': apiKey
        },
        body: JSON.stringify(bodyPayload)
    });

    const createDataText = await createRes.text();
    let createData;
    try {
        createData = JSON.parse(createDataText);
    } catch (e) {
        throw new Error(`Magnific HTML Error: ${createRes.status} ${createDataText.substring(0, 200)}`);
    }
    if (!createRes.ok) throw new Error(`Magnific API Error: ${createDataText}`);

    const taskId = createData.data.task_id;

    // 2. Poll until completion
    while (true) {
        await new Promise(r => setTimeout(r, 3000));

        const getRes = await fetch(`${apiUrl}/${taskId}`, {
            headers: { 'x-magnific-api-key': apiKey }
        });
        const getData = await getRes.json();

        if (getData.data.status === 'COMPLETED') {
            const generated = getData.data.generated?.[0];
            const imageUrl = generated?.url || generated || getData.data.output_image || null;
            if (!imageUrl) throw new Error("Magnific returned COMPLETED but no image URL found.");
            return imageUrl;
        }

        if (getData.data.status === 'FAILED') {
            const errDetail = getData.data.error || getData.data.error_message || getData.error || JSON.stringify(getData.data);
            throw new Error("Magnific task failed: " + errDetail);
        }
    }
}

// ── Build API URL and payload for a given model ─────────────────────────────

function _buildGeneratePayload(model, prompt, resolution, aspect_ratio) {
    if (model === 'mystic') {
        return {
            apiUrl: 'https://api.magnific.com/v1/ai/mystic',
            payload: { prompt, resolution, aspect_ratio, engine: "automatic", model: "fluid" }
        };
    }

    // Map internal aspect_ratio keys to standard format
    let ar = aspect_ratio;
    if (ar === "square_1_1") ar = "1:1";
    else if (ar === "widescreen_16_9") ar = "16:9";
    else if (ar === "social_story_9_16") ar = "9:16";
    else if (ar === "classic_4_3") ar = "4:3";
    else if (ar === "traditional_3_4") ar = "3:4";

    const payload = { prompt, aspect_ratio: ar };

    if (model === 'nano-banana-pro') {
        payload.resolution = (resolution || "2K").toUpperCase();
    }

    return {
        apiUrl: `https://api.magnific.com/v1/ai/text-to-image/${model}`,
        payload
    };
}

/**
 * Generate an image from a text prompt
 */
async function generateImage({ prompt, model = "mystic", resolution = "1k", aspect_ratio = "square_1_1", apiKey }) {
    if (!apiKey) throw new Error("Magnific API Key is missing. Please configure it in Settings.");

    const { apiUrl, payload } = _buildGeneratePayload(model, prompt, resolution, aspect_ratio);
    return await _createAndPollTask(apiUrl, payload, apiKey);
}

/**
 * Edit an image using reference_images
 */
async function editImage({ prompt, image, model = "mystic", resolution = "1k", targetW = 1, targetH = 1, apiKey }) {
    if (!apiKey) throw new Error("Magnific API Key is missing. Please configure it in Settings.");

    const { dataUrl, mimeType } = ensureDataUrl(image);
    const aspectStr = calcAspectStr(targetW, targetH);

    let apiUrl, bodyPayload;

    if (model === 'mystic') {
        apiUrl = 'https://api.magnific.com/v1/ai/mystic';
        bodyPayload = {
            prompt,
            model: "fluid",
            reference_images: [{ image: dataUrl, text: "Reference image for editing", mime_type: mimeType }],
            aspect_ratio: aspectStr,
            resolution: (resolution || "1K").toUpperCase(),
            engine: "automatic"
        };
    } else {
        apiUrl = `https://api.magnific.com/v1/ai/text-to-image/${model}`;
        bodyPayload = {
            prompt,
            reference_images: [{ image: dataUrl, text: "Reference image for editing", mime_type: mimeType }],
            aspect_ratio: aspectStr
        };
        if (model === 'nano-banana-pro') {
            bodyPayload.resolution = (resolution || "2K").toUpperCase();
        }
    }

    return await _createAndPollTask(apiUrl, bodyPayload, apiKey);
}

/**
 * Inpainting: fill masked region with AI-generated content
 */
async function generateFill({ prompt, image, mask, targetW = 1, targetH = 1, apiKey }) {
    if (!apiKey) throw new Error("Magnific API Key is missing. Please set it in Settings.");
    if (!image || !mask) throw new Error("Image and mask are required.");

    const { dataUrl: imageDataUrl, mimeType: imgMime } = ensureDataUrl(image);
    const { dataUrl: maskDataUrl, mimeType: maskMime } = ensureDataUrl(mask);

    const finalPrompt = (prompt || "Remove the object in the masked area") +
        " [SYSTEM: You must edit ONLY the region corresponding to the black area in the mask reference image. Keep the rest of the original image exactly unchanged.]";

    const aspectStr = calcAspectStr(targetW, targetH);
    const apiUrl = 'https://api.magnific.com/v1/ai/text-to-image/nano-banana-pro';

    const bodyPayload = {
        prompt: finalPrompt,
        reference_images: [
            { image: imageDataUrl, text: "Original Image", mime_type: imgMime },
            { image: maskDataUrl, text: "Mask (black area is the part to edit)", mime_type: maskMime }
        ],
        aspect_ratio: aspectStr,
        resolution: "2K"
    };

    return await _createAndPollTask(apiUrl, bodyPayload, apiKey);
}

module.exports = { testConnection, generateImage, editImage, generateFill };
