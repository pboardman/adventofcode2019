#!/usr/bin/env node

const fs = require('fs');

function generateMapObject() {
    // Read input file
    let mapFile = fs.readFileSync('input.txt').toString().split("\n");
    let orbitMap = {};
    // Build an orbit map
    for(i in mapFile) {
        if (mapFile[i]) {
            let orbitSplit = mapFile[i].split(')');
            orbitMap[orbitSplit[1]] = orbitSplit[0];
        }
    }
    return orbitMap
}

function totalOrbits(orbitMap) {
    let orbits = 0;
    for (i in orbitMap) {
        object = orbitMap[i];
        orbits++;
        while (object != 'COM') {
            orbits++;
            object = orbitMap[object];
        }
    }

    return orbits;
}

let orbitMap = generateMapObject();

console.log(totalOrbits(orbitMap));
