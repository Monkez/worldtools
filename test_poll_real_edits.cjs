const fs = require('fs');
const apiKey = fs.readFileSync('key.text', 'utf-8').trim();

// Let's create an image and a mask using Canvas.
const { createCanvas } = require('canvas');

const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Draw red background
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 512, 512);
const imageB64 = canvas.toDataURL('image/png');

// Draw mask: fully opaque, but center 100x100 is transparent
const maskCanvas = createCanvas(512, 512);
const mctx = maskCanvas.getContext('2d');
mctx.fillStyle = 'black'; // color doesn't matter, alpha does
mctx.fillRect(0, 0, 512, 512);
mctx.clearRect(200, 200, 112, 112); // transparent hole
const maskB64 = maskCanvas.toDataURL('image/png');

const postPayload = {
    prompt: "A blue square",
    model: "gptimage",
    image: imageB64,
    mask: maskB64,
    size: "512x512",
    response_format: "b64_json"
};

fetch('https://gen.pollinations.ai/v1/images/edits', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(postPayload)
})
.then(res => res.json())
.then(data => {
    if (data.data && data.data[0] && data.data[0].b64_json) {
        fs.writeFileSync('test_poll_out.png', Buffer.from(data.data[0].b64_json, 'base64'));
        console.log("Saved test_poll_out.png");
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
})
.catch(err => console.error(err));
