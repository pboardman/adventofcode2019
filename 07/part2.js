#!/usr/bin/env node

const IntcodeComputer = require('./intcode-computer');


function allPermutations(string) {
    var results = [];

    if (string.length === 1) {
      results.push(string);
      return results;
    }

    for (var i = 0; i < string.length; i++) {
      var firstChar = string[i];
      var charsLeft = string.substring(0, i) + string.substring(i + 1);
      var innerPermutations = allPermutations(charsLeft);
      for (var j = 0; j < innerPermutations.length; j++) {
        results.push(firstChar + innerPermutations[j]);
      }
    }
    return results;
}

// function nextAmp() {
//     if (currAmp < 5) {
//         currAmp++
//     } else {
//         currAmp = 1;
//     }
//     return currAmp
// }

permutations = allPermutations("56789");


let highestSignal = 0;
for (i in permutations) {
    let phaseSettings = permutations[i].split('').map(elem => parseInt(elem));

    // setup amps
    let amps = [
        {'amp': new IntcodeComputer('input.txt'), 'started': false},
        {'amp': new IntcodeComputer('input.txt'), 'started': false},
        {'amp': new IntcodeComputer('input.txt'), 'started': false},
        {'amp': new IntcodeComputer('input.txt'), 'started': false},
        {'amp': new IntcodeComputer('input.txt'), 'started': false},
    ];


    // Run Generators
    let ampNb = 0;
    amps[amps.length - 1]['amp'].outputs.push(0) // Bootstrap the amps

    let state;
    let currOutput;
    while (state !== 'halt') {
        // Get the last amp
        let lastAmp;
        if (ampNb === 0) {lastAmp = amps[amps.length - 1]} else {lastAmp = amps[ampNb - 1]}

        // On first startup, send the phase setting
        if (! amps[ampNb]['started']) {
            amps[ampNb]['amp'].inputs.push(phaseSettings[ampNb], lastAmp['amp'].outputs.shift());
            amps[ampNb]['started'] = true;
        } else {
            currOutput = lastAmp['amp'].outputs.shift()
            amps[ampNb]['amp'].inputs.push(currOutput);
        }

        // Run until we get an output
        state = amps[ampNb]['amp'].run()

        // Switch amp
        if (ampNb === amps.length - 1) {ampNb = 0} else {ampNb++}
    }

    if (currOutput > highestSignal) highestSignal = currOutput;
}

console.log(highestSignal)