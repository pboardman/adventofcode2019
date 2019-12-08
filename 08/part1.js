#!/usr/bin/node

const fs = require('fs');

imageData = fs.readFileSync('input.txt').toString().split('').map(elem => parseInt(elem));

let pixelWidth = 25;
let pixelHeight = 6;

function generateLayers(imageData) {
    // generate layers
    imageLayers = [];
    while (imageData.length > 0) {
        layer = [];
        for (let h = 0; h < pixelHeight; h++) {
            layer.push(imageData.splice(0, pixelWidth));
        }
        imageLayers.push(layer);
    }

    return imageLayers;
}


imageLayers = generateLayers(imageData)

// find layers with the fewer 0
let minZero;
for (i in imageLayers) {
    nbZero = 0
    for (j in imageLayers[i]) {
        nbZero += imageLayers[i][j].filter(nb => nb === 0).length;
    }
    if (! minZero || nbZero < minZero[1] ) minZero = [i, nbZero];
}

// Output answer
let nbOne = 0;
let nbTwo = 0;
for (i in imageLayers[minZero[0]]) {
    nbOne += imageLayers[minZero[0]][i].filter(nb => nb === 1).length;
    nbTwo += imageLayers[minZero[0]][i].filter(nb => nb === 2).length;
}

console.log(nbOne * nbTwo);