const { createCanvas, loadImage } = require('canvas');

loadImage('test_poll_out.png').then((image) => {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, image.width, image.height).data;
    
    // Check pixel at 0,0 (should be red if mask was respected)
    console.log('Pixel at 0,0:', data[0], data[1], data[2]);
    
    // Check pixel at 256,256 (should be blue or something else if mask was respected)
    const centerIdx = (256 * image.width + 256) * 4;
    console.log('Pixel at 256,256:', data[centerIdx], data[centerIdx+1], data[centerIdx+2]);
});
