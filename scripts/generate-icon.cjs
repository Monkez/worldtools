const fs = require('node:fs');
const path = require('node:path');
const { createCanvas, loadImage } = require('canvas');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'public', 'worldtools.png');
const target = path.join(root, 'build', 'worldtools.ico');
const sizes = [16, 24, 32, 48, 64, 128, 256];

function makeIco(images) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(images.length, 4);

    const entries = Buffer.alloc(images.length * 16);
    let offset = header.length + entries.length;
    images.forEach(({ size, data }, index) => {
        const entry = index * 16;
        entries.writeUInt8(size === 256 ? 0 : size, entry);
        entries.writeUInt8(size === 256 ? 0 : size, entry + 1);
        entries.writeUInt8(0, entry + 2);
        entries.writeUInt8(0, entry + 3);
        entries.writeUInt16LE(1, entry + 4);
        entries.writeUInt16LE(32, entry + 6);
        entries.writeUInt32LE(data.length, entry + 8);
        entries.writeUInt32LE(offset, entry + 12);
        offset += data.length;
    });
    return Buffer.concat([header, entries, ...images.map(image => image.data)]);
}

async function main() {
    const sourceImage = await loadImage(source);
    const images = sizes.map(size => {
        const canvas = createCanvas(size, size);
        canvas.getContext('2d').drawImage(sourceImage, 0, 0, size, size);
        return { size, data: canvas.toBuffer('image/png') };
    });
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, makeIco(images));
    console.log(`Generated ${target}`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
