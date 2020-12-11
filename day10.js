const fs = require('fs');

const content = fs.readFileSync('./input10.txt', 'utf-8');

const nums = content
    .trim()
    .split('\n')
    .map(x => parseInt(x));

const sorted = nums.sort((a,b) => a-b);

let ones = 0;
let threes = 1;
let last = 0;

/*
sorted.forEach(num => {
    console.log(num);
    const dif = num - last;
    if(dif === 1) {
        ones++;
    } else if(dif === 3) {
        threes++;
    } else {
        console.log('FAIL!');
    }
    last = num;
});

console.log(ones, threes, ones * threes);
*/
const target = sorted[sorted.length -1] + 3;

const numSet = new Set(sorted);
numSet.add(target);
console.log(target);
console.log(sorted[0]);

const cache = new Map();

function getArrangements(num) {
    console.log('Checking '+num);
    if(cache.has(num)) {
        console.log('Cache hit', num);
        return cache.get(num);
    }
    if(num === target) {
        return 1;
    }
    let ways = 0;
    [1,2,3].forEach(testVal => {
        if(numSet.has(num + testVal)) {
            ways += getArrangements(num + testVal);
        }
    });
    cache.set(num,ways);
    return ways;
}

console.log(getArrangements(0));