#!/usr/bin/node

const fs = require('fs')

// Read input file
function generateAsteroidField() {
    asteroidField = [];
    fs.readFileSync('input.txt').toString().split("\n").forEach(
        line => asteroidField.push(line.split(''))
    );
    return asteroidField
}

// Get all asteroids locations
function asteroidLocations(asteroidField) {
    asteroidLocations = []
    asteroidField.forEach(function(line, y) {
        line.forEach(function(space, x) {
            if (space == '#') asteroidLocations.push([y,x]);
        })
    });
    return asteroidLocations;
}

// Get coordinate ratio for all asteroid (+ 0 if right of the asteroid or 1 for left of asteroid)
function coordinateRatios(pos, asteroidPos) {
    return asteroidPos
    .filter(([y, x]) => x !== pos[1] || y !== pos[0])
    .map(([y, x]) => [x - pos[1], y - pos[0]])
    .map(([y, x]) => [y / x, x >= 0 ? 0 : 1])
}

function findBestAsteroid(asteroidLocations) {
    let bestAsteroid;
    asteroidLocations.forEach(function(pos) {
        coordsRatios = coordinateRatios(pos, asteroidLocations);
        asteroidInView = new Set(coordsRatios.map(elem => elem.toString())).size
        if (bestAsteroid < asteroidInView || ! bestAsteroid) {
            bestAsteroid = asteroidInView;
        }
    });
    return bestAsteroid
}


asteroidField = generateAsteroidField();
asteroidLocations = asteroidLocations(asteroidField);
console.log(findBestAsteroid(asteroidLocations));
