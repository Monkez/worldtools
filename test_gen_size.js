import fs from 'fs';

function getJpegSize(buffer) {
    let i = 0;
    if (buffer[i] !== 0xFF || buffer[i+1] !== 0xD8) return null;
    i += 2;
    while (i < buffer.length) {
        if (buffer[i] !== 0xFF) return null;
        let marker = buffer[i+1];
        i += 2;
        if (marker === 0xC0 || marker === 0xC2) {
            return {
                height: buffer.readUInt16BE(i+3),
                width: buffer.readUInt16BE(i+5)
            };
        }
        let len = buffer.readUInt16BE(i);
        i += len;
    }
    return null;
}

async function test(url) {
    console.log('Fetching:', url);
    const fetchRes = await fetch(url);
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Size:', getJpegSize(buffer));
}

async function run() {
    await test('https://gen.pollinations.ai/image/cat?width=1024&height=576');
    await test('https://gen.pollinations.ai/image/cat?size=1024x576');
}
run();
