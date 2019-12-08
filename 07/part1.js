#!/usr/bin/env node

const fs = require('fs');
let inputs = [];
let outputs = [];

function loadProgram() {
    // Read input file
    return fs.readFileSync('input.txt').toString().split(",").map(elem => parseInt(elem));
}

function getParamsValues(intcodeSeq, currPos, nbParam) {
    // Keep only opcode modes
    let modes = Math.trunc(intcodeSeq[currPos] / 100).toString().split('').reverse();

    // add missing modes
    while (nbParam > modes) {
        modes.push(0);
    }

    // Get the values
    let values = [];
    for (let i = 0; i <= nbParam; i++) {
        // position mode (get value at the position of param)
        if (modes[i] == 0) {
            values.push(intcodeSeq[intcodeSeq[currPos + i + 1]]);
        }
        // immediate mode
        else if (modes[i] == 1) {
            values.push(intcodeSeq[currPos + i + 1]);
        }
    }

    return values;
}

function computeSeq(intcodeSeq) {
    let currPos = 0;
    do {
        let opcode = intcodeSeq[currPos] % 100;

        switch(opcode) {
            case 1:
                // add: Add param1 and param2, store in param3
                values = getParamsValues(intcodeSeq, currPos, 2);
                intcodeSeq[intcodeSeq[currPos + 3]] = values[0] + values[1];
                nextJump = 4;
                break;
            case 2:
                // multiply: Multiply param1 and param2, store in param3
                values = getParamsValues(intcodeSeq, currPos, 2);
                intcodeSeq[intcodeSeq[currPos + 3]] = values[0] * values[1];
                nextJump = 4;
                break;
            // input: Set input value to first param address
            case 3:
                intcodeSeq[intcodeSeq[currPos + 1]] = inputs.shift();
                nextJump = 2;
                break;
            // output: Output value at first param address
            case 4:
                value = getParamsValues(intcodeSeq, currPos, 1)[0];
                outputs.push(value)
                console.log(`Outputting: ${value}`);
                nextJump = 2;
                break;
            // jump-if-true: jump to second param address if first param != 0
            case 5:
                values = getParamsValues(intcodeSeq, currPos, 2);
                if (values[0]) {
                    currPos = values[1];
                    nextJump = 0;
                } else {
                    nextJump = 3
                }
                break;
            // jump-if-false: jump to second param address if first param === 0
            case 6:
                values = getParamsValues(intcodeSeq, currPos, 2);
                if (!values[0]) {
                    currPos = values[1];
                    nextJump = 0;
                } else {
                    nextJump = 3;
                }
                break;
            // less than: if param1 < param2 store 1 in param3 else store 0 in param3
            case 7:
                values = getParamsValues(intcodeSeq, currPos, 2);
                if (values[0] < values[1]) {
                    intcodeSeq[intcodeSeq[currPos + 3]] = 1;
                } else {
                    intcodeSeq[intcodeSeq[currPos + 3]] = 0;
                }
                nextJump = 4;
                break;
            // equals: if param1 = param2 store 1 in param3 else store 0 in param3
            case 8:
                values = getParamsValues(intcodeSeq, currPos, 2);
                if (values[0] === values[1]) {
                    intcodeSeq[intcodeSeq[currPos + 3]] = 1;
                } else {
                    intcodeSeq[intcodeSeq[currPos + 3]] = 0;
                }
                nextJump = 4;
                break;
            case 99:
                console.log("Halting.")
                return;
            default:
                console.log("Something went wrong");
                console.log("Debug info:");
                console.log(`current position: ${currPos}`);
                console.log(`attempted opcode: ${opcode}`);
                console.log(`previous position: ${currPos - nextJump}`);
                console.log(`previous opcode: ${intcodeSeq[currPos - nextJump]}`);
                process.exit(1);
          }

        currPos += nextJump;

    } while (currPos <= intcodeSeq.length)
}


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

permutations = allPermutations("01234")

let highestSignal = 0;
for (i in permutations) {
    let phaseSettings = permutations[i].split('');

    outputs.push(0)
    for (let j = 0; j < phaseSettings.length; j++) {
        // Run Generator
        inputs.push(parseInt(phaseSettings[j]), outputs.shift())
        computeSeq(loadProgram());
    }

    outputSignal = outputs.shift();
    if (outputSignal > highestSignal) highestSignal = outputSignal;
}

console.log(highestSignal)