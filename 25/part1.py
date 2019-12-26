#!/usr/bin/env python3

import itertools

from intcode_computer import IntcodeComputer

def drop_items():
    for item in items:
        comp.inputs.extend(
            [ord(x) for x in f'drop {item}'] + [ord('\n')]
        )
        comp.run()


def equip_items(items_lst):
    for item in items_lst:
        comp.inputs.extend(
            [ord(x) for x in f'take {item}'] + [ord('\n')]
        )
        comp.run()


comp = IntcodeComputer("input.txt", ascii_mode=True)

get_items_commands = [
    'east',
    'take antenna',
    'east',
    'take ornament',
    'north',
    'west',
    'take fixed point',
    'east',
    'south',
    'west',
    'north',
    'north',
    'take asterisk',
    'south',
    'west',
    'west',
    'take astronaut ice cream',
    'east',
    'south',
    'take hologram',
    'north',
    'east',
    'south',
    'west',
    'south',
    'south',
    'south',
    'take dark matter',
    'north',
    'west',
    'north',
    'take monolith',
    'north',
    'north'
]

items = [
    'monolith',
    'antenna',
    'ornament',
    'asterisk',
    'fixed point',
    'dark matter',
    'hologram',
    'astronaut ice cream'
]

# Get all item combinations
possibilities = []
for i in range(0, 9):
    possibilities.extend(list(itertools.combinations(items, i)))


# Get all items
comp.run()
while get_items_commands:
    comp.inputs.extend(
        [ord(x) for x in get_items_commands.pop(0)] + [ord('\n')]
    )
    comp.run()

# Bruteforce item check
comp.outputs = []
for combination in possibilities:
    drop_items()
    equip_items(combination)

    comp.inputs.extend(
        [ord(x) for x in 'east'] + [ord('\n')]
    )
    comp.run()

    text = ''.join(map(lambda x: str(x), comp.outputs))
    comp.outputs = []

    if 'heavier' not in text and 'lighter' not in text:
        break

# Unused code to play manually
while True:
    comp.inputs.extend(
        [ord(x) for x in input()] + [ord('\n')]
    )
    comp.run()