const fs = require('fs');

const content = fs.readFileSync('./input3.txt','utf-8');

console.log(content);

const lines = content
    .split('\n')
    .filter(x => x.length > 0)
    .map(parseLine);

const steps = [
    {right:1, down: 1},
    {right:3, down: 1},
    {right:5, down: 1},
    {right:7, down: 1},
    {right:1, down: 2},
]

function countTrees({right, down}) {
    let rowCounter = 0;
    let trees = 0;

    for(let i = 0; i< lines.length; i += down) {
        if(lines[i][rowCounter % lines[i].length]) {
            trees++
        }
        rowCounter += right;
    }

    return trees;
}

const counts = steps.map(countTrees);

console.log(counts);

const total = counts.reduce((p,c) => p*c);

console.log(total);

function parseLine(line) {
    return line
        .split('')
        .map(char => char === '#');
}