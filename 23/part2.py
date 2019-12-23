#!/usr/bin/env python3

import os
import threading
import time

from intcode_computer import IntcodeComputer

class NAT:
    def __init__(self, computers):
        self.active_packet = (None, None)
        self.last_packet = (None, None)

        # Packet was sent in the last router loop
        self.packet_sent = True

        self.computers = computers


    def run(self):
        while True:
            idle = True
            for address, computer in computers.items():
                if len(computer['computer'].inputs) != 0:
                    idle = False

            if idle and not self.packet_sent:
                if self.active_packet == self.last_packet:
                    print(f'answer: {self.active_packet[1]}')
                    os._exit(0)

                print(f'Network is idle, sending {self.active_packet} to computer 0')
                computers[0]['computer'].inputs.extend(self.active_packet)
                self.last_packet = self.active_packet

            time.sleep(2)


def router(computers, nat):
    """
    route packets from source to destination
    """
    while True:
        packet_sent = False
        for address, computer in computers.items():
            # if we got a full packet (dest, X, Y)
            if len(computer['computer'].outputs) >= 3:
                packet_sent = True
                address = computer['computer'].outputs.pop(0)
                X = computer['computer'].outputs.pop(0)
                Y = computer['computer'].outputs.pop(0)
                print(f'Routing {X}, {Y} to {address}')

                if address == 255:
                    nat.active_packet = (X, Y)
                else:
                    computers[address]['computer'].inputs.extend([X, Y])

            if not packet_sent:
                nat.packet_sent = False
            else:
                nat.packet_sent = True


# Create computers and assign addresses
computers = {}
for i in range(0,50):
    computer = IntcodeComputer('input.txt')
    computers[i] = {'computer': computer, 'thread': threading.Thread(target=computer.run, name=f'computer {i}')}
    computers[i]['computer'].inputs.append(i)


# Starting the NAT
nat = NAT(computers)
nat_thread = threading.Thread(target=nat.run, daemon=True, name='NAT')
nat_thread.start()
print('Started NAT')

# Starting the router
router_thread = threading.Thread(target=router, args=(computers, nat), daemon=True, name='router')
router_thread.start()
print('Started router')

# Boot the computers
for address, computer in computers.items():
    computer['thread'].start()
    print(f'Booted computer {address}')