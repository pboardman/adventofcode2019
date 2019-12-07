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
            orbitMap[orbitSplit[1]] = {'orbiting': orbitSplit[0]};
        }
    }

    for (i in orbitMap) {
        object = orbitMap[i]['orbiting'];
        if (object !== 'COM') {
            if (! orbitMap[object]["orbitedBy"]){
                orbitMap[object]["orbitedBy"] = [i];
            } else {
                orbitMap[object]["orbitedBy"].push(i);
            }
        }
    }

    return orbitMap;
}

function jumpsToCOM(object, orbitMap) {
    let jumps = [];
    object = orbitMap[object]['orbiting'];
    jumps.push(object);
    while (object != 'COM') {
        object = orbitMap[object]['orbiting'];
        jumps.push(object);
    }

    return jumps
}

function nbJumpToDest(startObj, destObj, orbitMap) {
    // Find number of jumps to first node
    jumpsStartToCOM = jumpsToCOM(startObj, orbitMap);
    jumpsDestToCOM = jumpsToCOM(destObj, orbitMap);

    // Find closest common node
    let jumpsCommonNode;
    for (i in jumpsStartToCOM) {
        if (jumpsDestToCOM.includes(jumpsStartToCOM[i])){
            jumpsCommonNode = jumpsToCOM(jumpsStartToCOM[i], orbitMap);
            break;
        }
    }

    return jumpsStartToCOM.length + jumpsDestToCOM.length - (2 * jumpsCommonNode.length);
}

let orbitMap = generateMapObject();
console.log(nbJumpToDest(orbitMap['YOU']['orbiting'], orbitMap['SAN']['orbiting'], orbitMap));