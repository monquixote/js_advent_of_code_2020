const fs = require('fs');

const content = fs.readFileSync('./input17.txt', 'utf-8');

function generatePermutations(n) {
    result = []
    for(let i = 0;i< Math.pow(3,n); i++) {
        const nums = i
            .toString(3)
            .padStart(n)
            .split('')
            .map(x => Number(x) -1)
            
        result.push(nums);
    }
    return result.filter(x => !x.every(x => x === 0));
}

const input = content
    .trim()
    .split('\n')
    .map(x => x.split(''));

function generateStart(n) {
    return input.reduce((state, arr, i) => {
        return arr.reduce((state1, c, j) => {
            const cos = Array(n).fill(0);
            cos[0] = j;
            cos[1] = i;
            return c === '#' ? state1.set(cos.join(':'), true) : state1 }, state)
    }, new Map())
}

// Should be 38

function getNeighbours(node) {
    const split = node.split(':');
    return perms.map(perm => perm.map((x,i) => Number(split[i])+x).join(':'))
}

function addNeighbours(current) {
    const next = new Map();
    current.forEach((v, k) => {
        if (v) {
            next.set(k, true);
            getNeighbours(k, perms).forEach(n => {
                if (!next.has(n)) {
                    next.set(n, false);
                }
            });
        }
    });
    return next;
}

function countActiveNeighbours(state, key) {
    const ns = getNeighbours(key)
    return ns.filter(n => state.get(n)).length
}

function shouldBeActive(active, num) {
    if (active) {
        return num === 2 || num === 3
    } else {
        return num === 3
    }
}

function activate(current) {
    const next = new Map();
    current.forEach((v, k) => {
        const nactive = countActiveNeighbours(current, k)
        const should = shouldBeActive(v, nactive)
        next.set(k, should);
    });
    return next;
}

let perms;
function ex1(n) {
    let current = generateStart(n);
    perms = generatePermutations(n);
    for (let i = 0; i < 6; i++) {
        current = addNeighbours(current)
        current = activate(current)
    }
    let count = 0;
    current.forEach((v) => {
        if(v) {
            count++;
        }
    })
    return count;
}


console.log(ex1(3));



// console.log(generatePermutations(4))