const { createCanvas, loadImage } = require('canvas');

loadImage('test_poll_out2.png').then((image) => {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, image.width, image.height).data;
    
    console.log('Pixel at 0,0:', data[0], data[1], data[2]);
    const centerIdx = (256 * image.width + 256) * 4;
    console.log('Pixel at 256,256:', data[centerIdx], data[centerIdx+1], data[centerIdx+2]);
});
