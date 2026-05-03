const fs = require('fs');
const apiKey = fs.readFileSync('key.text', 'utf-8').trim();
const { createCanvas, loadImage } = require('canvas');

async function run() {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 512, 512);
    const imageBuffer = canvas.toBuffer('image/png');

    const maskCanvas = createCanvas(512, 512);
    const mctx = maskCanvas.getContext('2d');
    mctx.fillStyle = 'black'; 
    mctx.fillRect(0, 0, 512, 512);
    mctx.clearRect(200, 200, 112, 112); 
    const maskBuffer = maskCanvas.toBuffer('image/png');

    const formData = new FormData();
    formData.append('prompt', 'A blue square');
    formData.append('model', 'flux');
    formData.append('size', '512x512');
    formData.append('response_format', 'b64_json');
    formData.append('image', new Blob([imageBuffer], { type: 'image/png' }), 'image.png');
    formData.append('mask', new Blob([maskBuffer], { type: 'image/png' }), 'mask.png');

    console.log("Sending multipart...");
    const res = await fetch('https://gen.pollinations.ai/v1/images/edits', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        body: formData
    });
    
    const data = await res.json();
    if (data.data && data.data[0] && data.data[0].b64_json) {
        fs.writeFileSync('test_poll_out2.png', Buffer.from(data.data[0].b64_json, 'base64'));
        console.log("Saved test_poll_out2.png");
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}
run().catch(console.error);
