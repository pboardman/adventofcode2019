#!/usr/bin/env node

let lowerLimit = 193651;
let upperLimit = 649729;

// It is a six-digit number.
// The value is within the range given in your puzzle input.
// Two adjacent digits are the same (like 22 in 122345).
// Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).

function validateIncrement(password) {
    for (let i = 1; i < password.length; i++) {
        if (password[i -1] > password[i]) return false;
    }
    return true;
}

function validatedoubleDigit(password) {
    for (let i = 1; i < password.length; i++) {
        if (password[i] === password[i-1]) {
            return true;
        }
    }
}

let nbPassword = 0;
for (let i = lowerLimit; i <= upperLimit; i++) {
    // console.log(i);
    // split number to array
    passwordArray = i.toString().split('').map(Number)

    if (validatedoubleDigit(passwordArray) && validateIncrement(passwordArray)) {
        nbPassword++;
    }
}

console.log(nbPassword)