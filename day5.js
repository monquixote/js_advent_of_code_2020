const fs = require('fs');

const content = fs.readFileSync('./input5.txt','utf-8');

const lines = content.split('\n');

const nums = lines
    .filter(line => line.length > 0)
    .map(line => line.split('').map(char => char === 'B' || char === 'R' ? 1 : 0))
    .map(nums => [
        arr2Num(nums.slice(0,7)),
        arr2Num(nums.slice(-3))
    ])
    .map(([row, column]) => row * 8 + column)
 
 //   .forEach(([row, column]) => console.log(`Row: ${row} Column: ${column} ID ${row * 8 + column}`))

function arr2Num(arr) {
    return parseInt(arr.join(''),2);
}
/*
BFFFBBFRRR: row 70, column 7, seat ID 567.
FFFBBBFRRR: row 14, column 7, seat ID 119.
BBFFBBFRLL: row 102, column 4, seat ID 820.
*/
console.log(nums);

console.log('Max: ',Math.max(...nums));   

const sorted = nums.sort();

for(i = 0;i<sorted.length;i++) {
    if(sorted[i] +2 === sorted[i+1]) {
        console.log('Its', sorted[i]+1, sorted[i], sorted[i+1]);
    }
}