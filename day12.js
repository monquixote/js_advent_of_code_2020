const fs = require('fs');

const content = fs.readFileSync('./input12.txt', 'utf-8');

const commands = content
    .trim()
    .split('\n')
    .map(ins => [ins.slice(0, 1), Number(ins.slice(1))]);

const turns = {
    'L': -1,
    'R': 1
};

const directions = [
    'N', 'E', 'S', 'W'
];

const mod = (a, b) => ((a % b) + b) % b;

function changeDirection(direction, turn, degrees) {
    if (degrees % 90 !== 0) {
        throw Error('Unexpected turn angle');
    }
    const units = degrees / 90 * turns[turn];
    const dirInt = directions.indexOf(direction);
    if (dirInt === -1) {
        throw Error(`Direction ${direction} not found`);
    }
    const newDirInt = mod(dirInt + units, directions.length);

    const newDirChar = directions[newDirInt];

    if (!newDirChar) {
        throw Error('Direction not found');
    }
    return newDirChar;
}

function turn({ x, y }, amount) {
    const turn = mod(amount, 4);
    switch (turn) {
        case 0:
            return { x, y }
        case 1:
            return { x: y, y: x * -1 }
        case 2:
            return { x: x * -1, y: y * -1 }
        case 3:
            return { x: y * -1, y: x }
        default:
            throw Error('Kaboom!');
    }
}

function rotate(coords, direction, degrees) {
    if (degrees % 90 !== 0) {
        throw Error('Unexpected turn angle');
    }
    const amount = degrees / 90 * turns[direction];

    return turn(coords, amount)
}

function travelDirection({ x, y, d }, direction, unit) {
    if (direction === 'F') {
        direction = d;
    }
    switch (direction) {
        case 'N':
            y += unit
            break
        case 'S':
            y -= unit
            break
        case 'E':
            x += unit
            break
        case 'W':
            x -= unit
            break
        default:
            throw Error('Unexpected direction');
    }

    return { x, y, d };
}

function ex1(commands) {
    return commands.reduce(({ x, y, d }, command) => {
        const [ins, unit] = command
        let nextState;
        if (ins === 'L' || ins === 'R') {
            const newDir = changeDirection(d, ins, unit);
            nextState = { x, y, d: newDir };
        } else {
            nextState = travelDirection({ x, y, d }, ins, unit);
        }
        console.log(command, nextState);
        return nextState;
    }, { x: 0, y: 0, d: 'E' });
}

function moveShip({x,y,wx,wy}, amount) {
    for(let i = 0;i < amount; i++) {
        x += wx;
        y += wy;
    }
    return {x, y, wx, wy};
}

function ex2(commands) {
    return commands.reduce(({ x, y, wx, wy }, command) => {
        const [ins, unit] = command
        let nextState;
        if (ins === 'L' || ins === 'R') {
            const newDir = rotate({ x: wx, y: wy }, ins, unit);
            nextState = { x, y, wx: newDir.x, wy: newDir.y };
        } else if(ins === 'F') {
            nextState = moveShip({x,y,wx,wy}, unit);
        } else {
            const newDir = travelDirection({ x: wx, y: wy, d:'E' }, ins, unit);
            nextState = {x, y, wx: newDir.x, wy: newDir.y};
        }
        console.log(command, nextState);
        return nextState;
    }, { x: 0, y: 0, wx: 10, wy: 1 });
}

// const result = ex1(commands); 

// console.log(result, Math.abs(result.x) + Math.abs(result.y));

// Ans 1 = 1106

const changes = [1, 0, -1, 0];

const result2 = ex2(commands); 

console.log(result2, Math.abs(result2.x) + Math.abs(result2.y));


/*
R90 x = y , y = -x
R180 x = -x, y = -y


*/

//console.log(rotate({ x: 10, y: 10 }, 'L', 90))

// console.log(turn({x:10,y:10},5));