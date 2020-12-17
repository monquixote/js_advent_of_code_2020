const fs = require('fs');

const content = fs.readFileSync('./input15.txt', 'utf-8');

const lines = content
    .trim()
    .split('\n')
    .map(line => line.split(',').map(x => Number(x)));

function ex1(initial) {
    const history = initial.reduce((p, c, i) => {
        p[c] = [i];
        return p;
    }, {});
    console.log('starting history', history)
    // const trace = [];
    let current = initial[initial.length - 1];
    for (let i = initial.length; i < 2020; i++) {
        if (i % 100000 === 0) {
            console.log(i);
        }
        // console.log(current);
        // trace.push(current);

        const [x, y] = history[current].slice(-2);
        // console.log('current x and y', history, current, x, y)
        if (y === undefined) {
            current = 0;
        } else {
            current = y - x;
        }

        if (!history[current]) {
            history[current] = [i]
        } else {
            history[current].push(i);
        }

    }
    // console.log(trace);
    return current;
}

function ex2(initial) {
    const history = initial.reduce((p, c, i) => {
        p[c] = [undefined, i];
        return p;
    }, {});
    // console.log('starting history', history)
    // const trace = [];
    let current = initial[initial.length - 1];
    for (let i = initial.length; i < 30000000; i++) {
        if (i % 100000 === 0) {
            console.log(i);
        }

        const [x, y] = history[current];
        // console.log('current x and y', history, current, x, y)
        if (x === undefined) {
            current = 0;
        } else {
            current = y - x;
        }

        if (!history[current]) {
            history[current] = [undefined, i]
        } else {
            history[current][0] = history[current][1];
            history[current][1] = i; 
            /*
            history[current].push(i);
            if(history[current].length > 2) {
                history[current].shift()
            }
            */
        }

    }
    // console.log(trace);
    return current;
}

function ex3(initial) {
    const history = initial.reduce((p, c, i) => {
        p.set(c, [undefined, i]);
        return p;
    }, new Map());
    // console.log('starting history', history)
    // const trace = [];
    let current = initial[initial.length - 1];
    for (let i = initial.length; i < 30000000; i++) {
        if (i % 100000 === 0) {
            console.log(i);
        }

        const [x, y] = history.get(current);
        // console.log('current x and y', history, current, x, y)
        if (x === undefined) {
            current = 0;
        } else {
            current = y - x;
        }

        if (!history.has(current)) {
            history.set(current,[undefined, i])
        } else {
            const entry = history.get(current);
            entry[0] = entry[1];
            entry[1] = i; 
            /*
            history[current].push(i);
            if(history[current].length > 2) {
                history[current].shift()
            }
            */
        }

    }
    // console.log(trace);
    return current;
}

// 30000000
console.log(ex3(lines[0]));
// console.log(lines.map(line => ex1(line)));