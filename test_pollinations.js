import fs from 'fs';
import imageSize from 'image-size';

const dimensions = imageSize('test.jpg');
console.log(dimensions);
