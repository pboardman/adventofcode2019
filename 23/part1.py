#!/usr/bin/env python3

import os
import threading

from intcode_computer import IntcodeComputer

def router(computers):
    """
    route packets from source to destination
    """
    while True:
        for address, computer in computers.items():
            # if we got a full packet (dest, X, Y)
            if len(computer['computer'].outputs) >= 3:
                address = computer['computer'].outputs.pop(0)
                X = computer['computer'].outputs.pop(0)
                Y = computer['computer'].outputs.pop(0)
                print(f'Routing {X}, {Y} to {address}')

                if address == 255:
                    print(f'answer: {Y}')
                    os._exit(0)

                computers[address]['computer'].inputs.extend([X, Y])


# Create computers and assign addresses
computers = {}
for i in range(0,50):
    computer = IntcodeComputer('input.txt')
    computers[i] = {'computer': computer, 'thread': threading.Thread(target=computer.run, name=f'computer {i}')}
    computers[i]['computer'].inputs.append(i)


# Starting the router
router_thread = threading.Thread(target=router, args=(computers,), daemon=True, name='router')
router_thread.start()
print('Started router')

# boot the computers
for address, computer in computers.items():
    computer['thread'].start()
    print(f'Booted computer {address}')
