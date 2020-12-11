const fs = require('fs');

const content = fs.readFileSync('./input2.txt','utf-8');

const answer = content
    .split('\n')
    .filter(x => x.length > 0)
    .map(processLine2)
    .reduce((p,c) => c ? p + 1: p, 0);

console.log(answer);

function processLine(line) {
    console.log(line);
    const [nums, letterColon, pw] = line.split(' ');

    const letter = letterColon.charAt(0);

    const [min, max] = nums.split('-');

    const charCount = pw
        .split('')
        .reduce((p,c) => c === letter ? p + 1 : p, 0); 
    
    return charCount >= min && charCount <= max; 
}

function processLine2(line) {
    
    const [nums, letterColon, pw] = line.split(' ');

    const letter = letterColon.charAt(0);

    const [first, second] = nums.split('-');

    const chars = pw
        .split('')

    const isFirst = chars[first -1] === letter;
    const isSecond = chars[second -1] === letter;
    console.log(line, isFirst, isSecond);
    return isFirst ? !isSecond : isSecond;
}