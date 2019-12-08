#!/usr/bin/node

const fs = require('fs');

imageData = fs.readFileSync('input.txt').toString().split('').map(elem => parseInt(elem));

let pixelWidth = 25;
let pixelHeight = 6;

function generateLayers(imageData) {
    // generate layers
    let imageLayers = [];
    while (imageData.length > 0) {
        layer = [];
        for (let h = 0; h < pixelHeight; h++) {
            layer.push(imageData.splice(0, pixelWidth));
        }
        imageLayers.push(layer);
    }

    return imageLayers;
}

function pixelPrint(color) {
    // 0 is black, 1 is white
    if (color === 0) {
        process.stdout.write("\x1b[100m \x1b[49m");
    } else {
        process.stdout.write("\x1b[47m \x1b[49m");
    }
}


let imageLayers = generateLayers(imageData)

// Create empty image
let finalImage = [];
for (let i = 0; i < pixelHeight; i++) {
    finalImage.push(Array(pixelWidth).fill(2));
}

// Generate final image
for (let i in imageLayers) {
    for (let j in imageLayers[i]) {
        for (let k = 0; k < imageLayers[i][j].length; k++){
            if (finalImage[j][k] === 2) finalImage[j][k] = imageLayers[i][j][k];
        }
    }
}

// print image
for (i in finalImage) {
    finalImage[i].forEach(pixel => pixelPrint(pixel));
    process.stdout.write("\n");
}