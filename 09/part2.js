#!/usr/bin/node

const IntcodeComputer = require('./intcode-computer')

computer = new IntcodeComputer('input.txt')

computer.inputs.push(2)
computer.run()
