#!/usr/bin/env node

const fs = require('fs');

let requiredFuel = 0;

// Read input file
let fileArray = fs.readFileSync('input.txt').toString().split("\n");
for(i in fileArray) {
    if (fileArray[i]) {
        requiredFuel += Math.floor(parseInt(fileArray[i], 10) / 3) - 2
    }
}

console.log(`Part one answer: ${requiredFuel}`);