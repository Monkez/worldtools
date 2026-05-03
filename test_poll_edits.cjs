const fs = require('fs');
const apiKey = fs.readFileSync('key.text', 'utf-8').trim();

// 1x1 white pixel
const imageB64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
// 1x1 transparent pixel
const maskB64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR42mMAAQAABQABoO3yGgAAAABJRU5ErkJggg==";

const postPayload = {
    prompt: "make it red",
    model: "gptimage",
    image: imageB64,
    mask: maskB64,
    size: "1024x1024",
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
    console.log(JSON.stringify(data, null, 2));
})
.catch(err => console.error(err));
