const fs = require('fs');

const content = fs.readFileSync('./input11.txt', 'utf-8');



const state = content
    .trim()
    .split('\n')
    .map(x => x.split(''));

const edge = 'E'

const paddedRows = state.map(arr => [edge, ...arr, edge]);
const paddedColumns = [new Array(paddedRows[0].length).fill(edge), ...paddedRows, new Array(paddedRows[0].length).fill(edge)]

function getChanges(state, seatTollerance, countFunc) {
    const nextState = JSON.parse(JSON.stringify(state));
    let changes = 0;
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            if (state[i][j] === '.' || state[i][j] === edge) {
                continue;
            }
            const count = countFunc(state, i, j);
            if (count === 0 && state[i][j] === 'L') {
                nextState[i][j] = '#';
                changes++;
            } else if (count >= seatTollerance && state[i][j] === '#') {
                nextState[i][j] = 'L';
                changes++;
            }
        }
    }
    return [nextState, changes];
}

const deltas = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
];

function countOccupied(state, x, y) {
    let count = 0;
    deltas.forEach(([dx, dy]) => {
        if (state[x + dx][y + dy] === '#') {
            count++;
        }
    });
    return count;
}

function countSeen(state, x, y) {
    let count = 0;
    deltas.forEach(([dx, dy]) => {
        let x1 = x;
        let y1 = y;
        while (true) {
            x1 += dx;
            y1 += dy;
            if (state[x1][y1] === '#') {
                count++;
                break;
            }
            if (state[x1][y1] === edge || state[x1][y1] === 'L') {
                break;
            }
        }
    });
    return count;
}

function ex1() {
    let changes = 1;
    let nextState = paddedColumns;
    let iters = 0;

    while (changes > 0) {
        [nextState, changes] = getChanges(nextState, 4, countOccupied);
        iters++;
    }

    console.log('Done iterations: ', iters);

    let ans = 0;
    nextState.forEach(arr => arr.forEach(elm => {
        if (elm === '#') {
            ans++;
        }
    }))

    console.log('ans: ', ans);
}

function ex2() {
    let changes = 1;
    let nextState = paddedColumns;
    let iters = 0;

    while (changes > 0) {
        [nextState, changes] = getChanges(nextState, 5, countSeen);
        iters++;
    }

    console.log('Done iterations: ', iters);

    let ans = 0;
    nextState.forEach(arr => arr.forEach(elm => {
        if (elm === '#') {
            ans++;
        }
    }))

    console.log('ans: ', ans);
}


ex2();

// ans 1 2281