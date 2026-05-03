/**
 * Shared utilities for AI image providers
 */

/**
 * Calculate aspect ratio string from pixel dimensions
 * @param {number} w - width
 * @param {number} h - height
 * @returns {string} aspect ratio like "16:9", "1:1", etc.
 */
function calcAspectStr(w, h) {
    const ratio = w / h;
    if (ratio >= 2.1) return "21:9";
    if (ratio >= 1.6) return "16:9";
    if (ratio >= 1.4) return "3:2";
    if (ratio >= 1.25) return "4:3";
    if (ratio >= 1.1) return "5:4";
    if (ratio >= 0.9) return "1:1";
    if (ratio >= 0.8) return "4:5";
    if (ratio >= 0.7) return "3:4";
    if (ratio >= 0.6) return "2:3";
    return "9:16";
}

/**
 * Map user-selected aspect ratio to OpenAI-standard size string
 * @param {string} aspect_ratio - e.g. "widescreen_16_9"
 * @param {number} [width] - custom width
 * @param {number} [height] - custom height
 * @returns {{ finalW: number, finalH: number, openAiSize: string }}
 */
function mapAspectToDimensions(aspect_ratio, width, height) {
    let finalW = width || 1024;
    let finalH = height || 1024;
    let openAiSize = "1024x1024";

    if (!width || !height) {
        if (aspect_ratio === "widescreen_16_9")      { finalW = 1024; finalH = 576;  openAiSize = "1792x1024"; }
        else if (aspect_ratio === "social_story_9_16") { finalW = 576;  finalH = 1024; openAiSize = "1024x1792"; }
        else if (aspect_ratio === "classic_4_3")       { finalW = 1024; finalH = 768;  openAiSize = "1792x1024"; }
        else if (aspect_ratio === "traditional_3_4")   { finalW = 768;  finalH = 1024; openAiSize = "1024x1792"; }
    } else {
        if (width > height) openAiSize = "1792x1024";
        else if (height > width) openAiSize = "1024x1792";
    }

    return { finalW, finalH, openAiSize };
}

/**
 * Ensure an image string is a full data URL
 * @param {string} image - raw base64 or data URL
 * @returns {{ dataUrl: string, mimeType: string }}
 */
function ensureDataUrl(image) {
    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const dataUrl = image.startsWith('data:') ? image : `data:${mimeType};base64,${image}`;
    return { dataUrl, mimeType };
}

module.exports = { calcAspectStr, mapAspectToDimensions, ensureDataUrl };
