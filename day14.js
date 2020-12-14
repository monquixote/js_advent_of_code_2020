const fs = require('fs');

const content = fs.readFileSync('./input14.txt', 'utf-8');

const lines = content
    .trim()
    .split('\n')
    .map(line => line.split(' = '));

function applyMask(val, mask) {
    const binArr = val.toString('2').padStart(mask.length, '0').split('')
    const output = binArr.map((c, i) => {
        if (mask[i] !== 'X') {
            return mask[i]
        }
        return c
    })
    return parseInt(output.join(''), 2);
}

function ex1(lines) {
    const memory = {};
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    lines.forEach(([command, value]) => {
        if (command === 'mask') {
            mask = value;
        } else {
            const adr = Number(command.slice(4, -1))
            const val = Number(value);
            const result = applyMask(val, mask);
            memory[adr] = result;
        }
    })
    return Object.values(memory).reduce((total, num) => total + num)
}

function getOptions(char) {
    return char === 'X' ? ['0', '1'] : [char];
}

function permuteMasks([head, ...tail]) {
    const options = getOptions(head);
    if (tail.length === 0) {
        return options;
    }
    const tailOptions = permuteMasks(tail);
    return tailOptions.flatMap(perm => options.map(opt => [opt, ...perm]))
}

function getMasks(maskStr) {
    const maskArr = permuteMasks(maskStr.split(''));
    return maskArr.map(arr => arr.join(''));
}

function applyMemoryMask(val, mask) {
    const binArr = val.toString('2').padStart(mask.length, '0').split('')
    const maskArr = mask.split('')
    const output = binArr.map((c, i) => {
        if (mask[i] === 'X' || mask[i] === '1' ) {
            return mask[i]
        }
        return c
    })
    return output.join('');
}

function ex2(lines) {
    const memory = {};
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    lines.forEach(([command, value]) => {
        if (command === 'mask') {
            mask = value;
        } else {
            const adr = Number(command.slice(4, -1))
            const val = Number(value)
            const memoryMask = applyMemoryMask(adr, mask);
            const permutations = getMasks(memoryMask);
            permutations.forEach(p => memory[p] = val);
        }
    })
    return Object.values(memory).reduce((total, num) => total + num)
}

console.log(ex1(lines))
console.log(ex2(lines))