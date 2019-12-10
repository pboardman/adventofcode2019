const fs = require('fs');

class IntcodeComputer {
    constructor(programCode) {
        this.intcodeSeq = this.loadProgram(programCode)

        this.inputs = [];
        this.outputs = [];

        this.nextJump = 0;
        this.currPos = 0;
        this.relativeBase = 0;
    }

    loadProgram(programCode) {
        // if input is already an array return it, else read the program file
        if (typeof(programCode) == "object") {
            return programCode
        } else {
            return fs.readFileSync(programCode).toString().split(",").map(elem => parseInt(elem));
        }
    }

    extendMemory(memoryAddress) {
        if (memoryAddress >= this.intcodeSeq.length) {
            let memoryEnd = this.intcodeSeq.length

            this.intcodeSeq.length = memoryAddress + 1;
            this.intcodeSeq.fill(0, memoryEnd);
        }
    }

    getParamsValues(params) {
        // Keep only opcode modes
        let modes = Math.trunc(this.intcodeSeq[this.currPos] / 100).toString().split('').reverse();

        let nbParam = params.length

        // add missing modes
        while (nbParam > modes.length) {
            modes.push(0);
        }

        // Get the values
        let values = [];
        for (let i = 0; i < nbParam; i++) {
            let valuePos;

            // position mode (get value at the position of param)
            if (modes[i] == 0) {
                valuePos = this.intcodeSeq[this.currPos + i + 1];
            }
            // immediate mode
            else if (modes[i] == 1) {
                valuePos = this.currPos + i + 1;
            }
            // relative mode
            else if (modes[i] == 2) {
                valuePos = this.relativeBase + this.intcodeSeq[this.currPos + i + 1];
            }

            // Extend memory if needed
            this.extendMemory(valuePos)

            // add parameters to values
            if (params[i] === 'v'){
                values.push(this.intcodeSeq[valuePos]);
            }
            else {
                values.push(valuePos);
            }
        }

        return values;
    }

    run() {
        let values;

        do {
            this.currPos += this.nextJump;

            let opcode = this.intcodeSeq[this.currPos] % 100;

            switch(opcode) {
                case 1:
                    // add: Add param1 and param2, store in param3
                    values = this.getParamsValues(['v', 'v', 'p']);
                    this.intcodeSeq[values[2]] = values[0] + values[1];
                    this.nextJump = 4;
                    break;
                case 2:
                    // multiply: Multiply param1 and param2, store in param3
                    values = this.getParamsValues(['v', 'v', 'p']);
                    this.intcodeSeq[values[2]] = values[0] * values[1];
                    this.nextJump = 4;
                    break;
                // input: Set input value to first param address
                case 3:
                    values = this.getParamsValues(['p']);
                    this.intcodeSeq[values[0]] = this.inputs.shift();
                    this.nextJump = 2;
                    break;
                // output: Output value at first param address
                case 4:
                    values = this.getParamsValues(['v']);
                    console.log(values[0])
                    this.outputs.push(values[0])
                    this.nextJump = 2;
                    break;
                // jump-if-true: jump to second param address if first param != 0
                case 5:
                    values = this.getParamsValues(['v', 'v']);
                    if (values[0]) {
                        this.currPos = values[1];
                        this.nextJump = 0;
                    } else {
                        this.nextJump = 3
                    }
                    break;
                // jump-if-false: jump to second param address if first param === 0
                case 6:
                    values = this.getParamsValues(['v', 'v']);
                    if (!values[0]) {
                        this.currPos = values[1];
                        this.nextJump = 0;
                    } else {
                        this.nextJump = 3;
                    }
                    break;
                // less than: if param1 < param2 store 1 in param3 else store 0 in param3
                case 7:
                    values = this.getParamsValues(['v', 'v', 'p']);
                    if (values[0] < values[1]) {
                        this.intcodeSeq[values[2]] = 1;
                    } else {
                        this.intcodeSeq[values[2]] = 0;
                    }
                    this.nextJump = 4;
                    break;
                // equals: if param1 = param2 store 1 in param3 else store 0 in param3
                case 8:
                    values = this.getParamsValues(['v', 'v', 'p']);
                    if (values[0] === values[1]) {
                        this.intcodeSeq[values[2]] = 1;
                    } else {
                        this.intcodeSeq[values[2]] = 0;
                    }
                    this.nextJump = 4;
                    break;
                case 9:
                    this.relativeBase += this.getParamsValues(['v'])[0];
                    this.nextJump = 2;
                    break;
                case 99:
                    return 'halt';
                default:
                    console.log("Something went wrong");
                    console.log("Debug info:");
                    console.log(`current position: ${this.currPos}`);
                    console.log(`attempted opcode: ${opcode}`);
                    console.log(`previous position: ${this.currPos - this.nextJump}`);
                    console.log(`previous opcode: ${this.intcodeSeq[this.currPos - this.nextJump]}`);
                    process.exit(1);
              }

        } while (this.currPos <= this.intcodeSeq.length)
    }
}

module.exports = IntcodeComputer;
