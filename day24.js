'use strict'

const { resourceLimits } = require('worker_threads');

const moves = require('fs').readFileSync(process.argv[2], 'utf-8')
    .trim()
    .split('\n')
    .map(x => x.split(''))
    .map(parseDirections)

function parseDirections([h, ...t]) {
    if (!h) {
        return []
    }
    if (h === 'n' || h === 's') {
        const [h2, ...t2] = t;
        return [h + h2, ...parseDirections(t2)]
    }
    return [h, ...parseDirections(t)];
}

const tileMap = new Map()

function followDirections(directions) {
    return directions
        .reduce((cords, direction) => applyMove(direction, cords), [0, 0])
}

function flipTiles(tileMap, moves) {
    for (let directions of moves) {
        const pos = followDirections(directions)
        const key = posToKey(pos)
        tileMap.set(key, !tileMap.get(key))
    }
    return tileMap;
}

function applyMove(move, [x, y]) {
    switch (move) {
        case 'e':
            return [x + 1, y]
        case 'w':
            return [x - 1, y]
        case 'se':
            return [x + 0.5, y - 1]
        case 'sw':
            return [x - 0.5, y - 1]
        case 'ne':
            return [x + 0.5, y + 1]
        case 'nw':
            return [x - 0.5, y + 1]
        default:
            throw Error('Unrecognised input: ' + move)
    }
}

function countTrue(map) {
    return Array.from(map.values()).filter(Boolean).length
}

const legalMoves = ['e', 'w', 'ne', 'se', 'nw', 'sw']

function getAllMoves(pos) {
    return legalMoves.map(move => applyMove(move, pos))
}

function removeWhiteTiles(map) {
    const newMap = new Map()
    map.forEach((value, key) => {
        if (value === true) {
            newMap.set(key, true);
        }
    })
    return newMap;
}

function posToKey([x, y]) {
    return `${x}:${y}`
}

function keyToPos(key) {
    return key.split(':').map(Number)
}

function generateWhiteTiles(map) {
    Array
        .from(map.keys())
        .map(keyToPos)
        .flatMap(getAllMoves)
        .map(posToKey)
        .forEach(key => {
            if (!map.get(key) === true) {
                map.set(key, false)
            }
        })
    return map
}

function countSurrounding(key, map) {
    const pos = keyToPos(key)
    return getAllMoves(pos)
        .map(posToKey)
        .filter(key => map.get(key) === true)
        .length
}

function flipSurrounding(map) {
    const result = new Map();
    map.forEach((value, key) => {
        const count = countSurrounding(key, map)
        if(value === true) {
            if(count === 0 || count > 2) {
                result.set(key, false)
            } else {
                result.set(key, true)
            }
        } else {
            if(count === 2) {
                result.set(key, true)
            } else {
                result.set(key, false)
            }
        }
    })
    return result 
}

function ex2(tileMap, iterations) {
    let currentMap = tileMap
    for (let i = 0; i < iterations; i++) {
        const withoutWhite = removeWhiteTiles(currentMap)
        const withWhite = generateWhiteTiles(withoutWhite)
        currentMap = flipSurrounding(withWhite)
        console.log(`${i + 1} ${Array.from(currentMap.values()).filter(Boolean).length}`)
    }
}

const result = flipTiles(tileMap, moves);
console.log(countTrue(result))
ex2(result, 100);