#!/usr/bin/env node

const fs = require('fs');

let requiredFuel = 0;

let computeFuel = (mass) => Math.floor(parseInt(mass, 10) / 3) - 2

// Read input file
let fileArray = fs.readFileSync('input.txt').toString().split("\n");
for(i in fileArray) {
    if (fileArray[i]) {
        requiredFuel += computeFuel(fileArray[i])
    }
}

console.log(`Part one answer: ${requiredFuel}`);
