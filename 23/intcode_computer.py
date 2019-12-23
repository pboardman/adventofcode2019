#!/usr/bin/env python3

import itertools
import logging
import math
import sys
import time

class IntcodeComputer:
    def __init__(self, program_code, pause_on_output = False, logger = logging):
        # Set logging level
        logger.getLogger().setLevel(logging.INFO)
        self.logger = logger

        self.intcode_seq = self.load_program(program_code)
        self.logger.debug(f'program loaded: {self.intcode_seq}')

        self.pause_on_output = pause_on_output

        self.inputs = []
        self.outputs = []

        self.next_jump = 0
        self.curr_pos = 0
        self.relative_base = 0

        self.state = 'READY'
        self.pause = False

        # Value to use if inputs is empty and opcode 3 is called
        self.default_input = -1

        self.opcode_func = {
            1: self.add,
            2: self.multiply,
            3: self.input_val,
            4: self.output,
            5: self.jump_if_true,
            6: self.jump_if_false,
            7: self.less_than,
            8: self.equals,
            9: self.change_rel_base,
            99: self.halt,
        }


    def load_program(self, program_code):
        self.logger.debug("Loading program:")
        if type(program_code) == str:
            return list(
                map(
                    lambda e: int(e),
                    open(program_code).read().split(',')
                )
            )
        elif type(program_code) == list:
            return program_code
        else:
            print("Invalid program format")
            exit(1)


    def extend_memory(self, memory_address):
        if memory_address >= len(self.intcode_seq):
            self.intcode_seq.extend(
                itertools.repeat(0, memory_address - len(self.intcode_seq) + 1)
            )


    def get_params(self, params):
        # Get modes
        modes = list(
            map(
                lambda e: int(e),
                list(str(math.trunc(self.intcode_seq[self.curr_pos] / 100)))
            )
        )
        modes.reverse()

        nb_param = len(params)

        while nb_param > len(modes):
            modes.append(0)

        values = []
        for i in range(nb_param):
            value_pos = 0
            # Position mode (get value at the position of param)
            if modes[i] == 0:
                value_pos = self.intcode_seq[self.curr_pos + i + 1]
            # Immediate mode
            elif modes[i] == 1:
                value_pos = self.curr_pos + i + 1
            # Relative mode
            elif modes[i] == 2:
                value_pos = self.relative_base + self.intcode_seq[self.curr_pos + i + 1]

            # Extend memory if needed
            self.extend_memory(value_pos)

            # Add value or position
            if params[i] == 'v':
                values.append(self.intcode_seq[value_pos])
            elif params[i] == 'p':
                values.append(value_pos)

        return values


    def add(self):
        values = self.get_params(['v', 'v', 'p'])
        self.logger.debug(f'values: {values}')
        self.logger.debug(f'opcode add: setting position {values[2]} to {values[0]} + {values[1]} ({values[0] + values[1]})')
        self.intcode_seq[values[2]] = values[0] + values[1]
        self.next_jump = 4


    def multiply(self):
        values = self.get_params(['v', 'v', 'p'])
        self.logger.debug(f'values: {values}')
        self.logger.debug(f'opcode multiply: setting position {values[2]} to {values[0]} * {values[1]} ({values[0] * values[1]})')
        self.intcode_seq[values[2]] = values[0] * values[1]
        self.next_jump = 4


    def input_val(self):
        values = self.get_params(['p'])
        input_value = self.inputs.pop(0) if self.inputs else self.default_input

        # Keeps the computer from using too much ressources while idle
        if input_value == -1:
            time.sleep(1)

        self.logger.debug(f'values: {values}')
        self.logger.debug(f'opcode input: putting {input_value} in position {values[0]}')
        self.intcode_seq[values[0]] = input_value
        self.next_jump = 2


    def output(self):
        value = self.get_params(['v'])[0]
        self.logger.debug(f'opcode output: outputting {value}')
        self.outputs.append(value)
        self.next_jump = 2

        if self.pause_on_output:
            self.logger.debug('=== pause on output is on, returning')
            # Will pause after this opcode
            self.pause = True


    def jump_if_true(self):
        values = self.get_params(['v', 'v'])

        if values[0] != 0:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode jump_if_true: {values[0]} is not 0, jumping to {values[1]}')
            self.curr_pos = values[1]
            self.next_jump = 0
        else:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode jump_if_true: {values[0]} is 0, NOT jumping to {values[1]}')
            self.next_jump = 3


    def jump_if_false(self):
        values = self.get_params(['v', 'v'])

        if values[0] == 0:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode jump_if_false: {values[0]} is 0, jumping to {values[1]}')
            self.curr_pos = values[1]
            self.next_jump = 0
        else:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode jump_if_false: {values[0]} is not 0, NOT jumping to {values[1]}')
            self.next_jump = 3


    def less_than(self):
        values = self.get_params(['v', 'v', 'p'])

        if values[0] < values[1]:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode less_than: {values[0]} is less than {values[1]} setting position {values[2]} to 1')
            self.intcode_seq[values[2]] = 1
        else:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode less_than: {values[0]} is NOT less than {values[1]} setting position {values[2]} to 0')
            self.intcode_seq[values[2]] = 0

        self.next_jump = 4


    def equals(self):
        values = self.get_params(['v', 'v', 'p'])

        if values[0] == values[1]:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode equals: {values[0]} is equal to {values[1]} setting position {values[2]} to 1')
            self.intcode_seq[values[2]] = 1
        else:
            self.logger.debug(f'values: {values}')
            self.logger.debug(f'opcode equals: {values[0]} is NOT equal to {values[1]} setting position {values[2]} to 0')
            self.intcode_seq[values[2]] = 0

        self.next_jump = 4


    def change_rel_base(self):
        new_rel_base = self.relative_base + self.get_params(['v'])[0]
        self.logger.debug(f'opcode change_rel_base: changing relative base from {self.relative_base} to {new_rel_base}')
        self.relative_base = new_rel_base
        self.next_jump = 2


    def halt(self):
        self.logger.debug(f'opcode halt: halting program')
        self.state = 'HALTED'
        self.pause = True


    def run(self):
        self.pause = False

        if self.state == 'READY' or 'PAUSED':
            self.state = 'RUNNING'
        else:
            print(f'cannot run in state {self.state}')

        while (self.curr_pos != len(self.intcode_seq)):
            self.curr_pos = self.curr_pos + self.next_jump


            opcode = self.intcode_seq[self.curr_pos] % 100

            self.logger.debug(f'current position: {self.curr_pos}')
            self.logger.debug(f'opcode: {opcode}')
            self.logger.debug(f'full opcode: {self.intcode_seq[self.curr_pos]}')

            # Execute opcode
            self.opcode_func[opcode]()

            if self.pause:
                self.logger.debug('pause was triggered, pausing')
                return
