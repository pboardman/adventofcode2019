const fs = require('fs');

class IntcodeComputer {
    constructor(programCode) {
        this.intcodeSeq = this.loadProgram(programCode)

        this.inputs = [];
        this.outputs = [];

        this.nextJump = 0;
        this.currPos = 0;
    }

    loadProgram(programCode) {
        // if input is already an array return it, else read the program file
        if (typeof(programCode) == "object") {
            return programCode
        } else {
            return fs.readFileSync(programCode).toString().split(",").map(elem => parseInt(elem));
        }
    }

    getParamsValues(nbParam) {
        // Keep only opcode modes
        let modes = Math.trunc(this.intcodeSeq[this.currPos] / 100).toString().split('').reverse();

        // add missing modes
        while (nbParam > modes) {
            modes.push(0);
        }

        // Get the values
        let values = [];
        for (let i = 0; i <= nbParam; i++) {
            // position mode (get value at the position of param)
            if (modes[i] == 0) {
                values.push(this.intcodeSeq[this.intcodeSeq[this.currPos + i + 1]]);
            }
            // immediate mode
            else if (modes[i] == 1) {
                values.push(this.intcodeSeq[this.currPos + i + 1]);
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
                    values = this.getParamsValues(2);
                    this.intcodeSeq[this.intcodeSeq[this.currPos + 3]] = values[0] + values[1];
                    this.nextJump = 4;
                    break;
                case 2:
                    // multiply: Multiply param1 and param2, store in param3
                    values = this.getParamsValues(2);
                    this.intcodeSeq[this.intcodeSeq[this.currPos + 3]] = values[0] * values[1];
                    this.nextJump = 4;
                    break;
                // input: Set input value to first param address
                case 3:
                    this.intcodeSeq[this.intcodeSeq[this.currPos + 1]] = this.inputs.shift();
                    this.nextJump = 2;
                    break;
                // output: Output value at first param address
                case 4:
                    values = this.getParamsValues(1)[0];
                    this.outputs.push(values)
                    this.nextJump = 2;
                    return // Pause after output for day 7 challenge
                    break;
                // jump-if-true: jump to second param address if first param != 0
                case 5:
                    values = this.getParamsValues(2);
                    if (values[0]) {
                        this.currPos = values[1];
                        this.nextJump = 0;
                    } else {
                        this.nextJump = 3
                    }
                    break;
                // jump-if-false: jump to second param address if first param === 0
                case 6:
                    values = this.getParamsValues(2);
                    if (!values[0]) {
                        this.currPos = values[1];
                        this.nextJump = 0;
                    } else {
                        this.nextJump = 3;
                    }
                    break;
                // less than: if param1 < param2 store 1 in param3 else store 0 in param3
                case 7:
                    values = this.getParamsValues(2);
                    if (values[0] < values[1]) {
                        this.intcodeSeq[this.intcodeSeq[this.currPos + 3]] = 1;
                    } else {
                        this.intcodeSeq[this.intcodeSeq[this.currPos + 3]] = 0;
                    }
                    this.nextJump = 4;
                    break;
                // equals: if param1 = param2 store 1 in param3 else store 0 in param3
                case 8:
                    values = this.getParamsValues(2);
                    if (values[0] === values[1]) {
                        this.intcodeSeq[this.intcodeSeq[this.currPos + 3]] = 1;
                    } else {
                        this.intcodeSeq[this.intcodeSeq[this.currPos + 3]] = 0;
                    }
                    this.nextJump = 4;
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