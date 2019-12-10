#!/usr/bin/node

const IntcodeComputer = require('./intcode-computer')

computer = new IntcodeComputer('input.txt')

computer.inputs.push(1)
computer.run()
