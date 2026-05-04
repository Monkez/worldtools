/**
 * Pollinations AI Provider
 * Handles image generation and image-to-image editing via Pollinations API.
 * 
 * Docs: https://gen.pollinations.ai/docs
 * - GET  /image/{prompt}          → direct image generation (width/height params)
 * - POST /v1/images/generations   → OpenAI-compatible generation (size param, image field for i2i)
 */

const { mapAspectToDimensions } = require('./utils');

async function uploadToTmpFiles(base64DataUrl) {
    try {
        const b64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;
        const mimeMatch = base64DataUrl.match(/^data:(image\/\w+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const ext = mime.split('/')[1] || 'png';
        const buffer = Buffer.from(b64, 'base64');
        
        const formData = new FormData();
        formData.append('file', new Blob([buffer], { type: mime }), `image.${ext}`);
        
        const res = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data && data.status === 'success' && data.data && data.data.url) {
            return data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/').replace('http://', 'https://');
        }
        throw new Error("Invalid response from tmpfiles");
    } catch (e) {
        throw new Error("Failed to upload image to temp host: " + e.message);
    }
}

/**
 * Test Pollinations API key validity
 */
async function testConnection(apiKey) {
    if (!apiKey) {
        return { success: true, message: "Connection OK (Free Tier - Image Gen Only)" };
    }

    const response = await fetch('https://gen.pollinations.ai/v1/models', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data.error?.message || 'Invalid Pollinations API Key' };
    }

    return { success: true, message: "Connection OK (Premium Tier)" };
}

/**
 * Generate an image from a text prompt
 * @param {object} options
 * @param {string} options.prompt
 * @param {string} [options.model="flux"]
 * @param {string} [options.aspect_ratio="square_1_1"]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.apiKey]
 * @returns {Promise<string>} base64 data URL or remote URL
 */
async function generateImage({ prompt, model = "flux", aspect_ratio = "square_1_1", width, height, apiKey }) {
    const { finalW, finalH, openAiSize } = mapAspectToDimensions(aspect_ratio, width, height);
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt);

    // Build GET URL as fallback
    let getUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalW}&height=${finalH}&seed=${seed}&model=${model}&nologo=true`;
    let fetchOptions = { method: 'GET' };

    if (apiKey) {
        getUrl += `&key=${encodeURIComponent(apiKey)}`;
        fetchOptions.headers = { 'Authorization': `Bearer ${apiKey}` };

        // Try POST first with standard OpenAI sizes for better aspect ratio support
        try {
            const postPayload = {
                prompt,
                model,
                size: openAiSize,
                seed,
                nologo: true,
                response_format: "b64_json"
            };

            const postRes = await fetch('https://gen.pollinations.ai/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(postPayload)
            });

            const postData = await postRes.json();

            if (postData?.data?.[0]?.b64_json) {
                return `data:image/jpeg;base64,${postData.data[0].b64_json}`;
            }
            if (postData?.data?.[0]?.url) {
                return postData.data[0].url;
            }
        } catch (e) {
            console.error("Pollinations POST error (falling back to GET):", e.message);
        }
    }

    // Fallback: GET endpoint
    const fetchRes = await fetch(getUrl, fetchOptions);

    if (!fetchRes.ok) {
        const errText = await fetchRes.text();
        throw new Error(`Pollinations API Error: ${fetchRes.status} - ${errText}`);
    }

    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

/**
 * Edit an image using image-to-image generation
 * Uses POST /v1/images/generations with the `image` field (Pollinations extension)
 * 
 * @param {object} options
 * @param {string} options.prompt
 * @param {string} options.image - base64 data URL of the source image
 * @param {string} [options.model="kontext"]
 * @param {number} [options.targetW=1]
 * @param {number} [options.targetH=1]
 * @param {string} options.apiKey
 * @returns {Promise<string>} base64 data URL or remote URL
 */
async function editImage({ prompt, image, model = "kontext", targetW = 1, targetH = 1, apiKey }) {
    if (!apiKey) throw new Error("Pollinations API Key is required for image editing.");

    console.log("Uploading reference image to tmpfiles...");
    const uploadedImageUrl = await uploadToTmpFiles(image);

    // Determine size from aspect ratio
    const ratio = targetW / targetH;
    let openAiSize = "1024x1024";
    if (ratio > 1.2) openAiSize = "1792x1024";
    else if (ratio < 0.8) openAiSize = "1024x1792";

    const postPayload = {
        prompt,
        model,
        image: uploadedImageUrl,
        size: openAiSize,
        response_format: "b64_json"
    };

    const response = await fetch('https://gen.pollinations.ai/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(postPayload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Pollinations API Error: " + JSON.stringify(data?.error || data));
    }

    if (data?.data?.[0]?.b64_json) {
        return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    if (data?.data?.[0]?.url) {
        return data.data[0].url;
    }

    throw new Error("No image returned from Pollinations. Response: " + JSON.stringify(data));
}

/**
 * Inpainting: edit a specific area using a mask
 * Uses POST /v1/images/edits (OpenAI-compatible)
 * 
 * @param {object} options
 * @param {string} options.prompt
 * @param {string} options.image - base64 data URL of the source image
 * @param {string} options.mask - base64 data URL of the mask (black = edit area, white = keep)
 * @param {number} [options.targetW=1]
 * @param {number} [options.targetH=1]
 * @param {string} options.apiKey
 * @param {string} [options.model="gptimage"]
 * @returns {Promise<string>} base64 data URL
 */
async function generateFill({ prompt, image, mask, targetW = 1, targetH = 1, apiKey, model = "gptimage" }) {
    if (!apiKey) throw new Error("Pollinations API Key is required for inpainting.");
    if (!image) throw new Error("Image is required for inpainting.");
    if (!mask) throw new Error("Mask is required for inpainting.");

    console.log("Uploading image and mask to tmpfiles...");
    const [uploadedImageUrl, uploadedMaskUrl] = await Promise.all([
        uploadToTmpFiles(image),
        uploadToTmpFiles(mask)
    ]);

    // Determine size from aspect ratio
    const ratio = targetW / targetH;
    let size = "1024x1024";
    if (ratio > 1.2) size = "1792x1024";
    else if (ratio < 0.8) size = "1024x1792";

    const postPayload = {
        prompt,
        model,
        image: uploadedImageUrl,
        mask: uploadedMaskUrl,
        size,
        response_format: "b64_json"
    };

    const response = await fetch('https://gen.pollinations.ai/v1/images/edits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(postPayload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Pollinations Inpainting Error: " + JSON.stringify(data?.error || data));
    }

    if (data?.data?.[0]?.b64_json) {
        return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    if (data?.data?.[0]?.url) {
        return data.data[0].url;
    }

    throw new Error("No image returned from Pollinations inpainting. Response: " + JSON.stringify(data));
}

module.exports = { testConnection, generateImage, editImage, generateFill };
