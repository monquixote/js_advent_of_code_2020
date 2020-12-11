const fs = require('fs');

const content = fs.readFileSync('./input9.txt', 'utf-8');

const nums = content
    .trim()
    .split('\n')
    .map(x => parseInt(x));

const preamble = 25;

function checkNumber(val, arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[i] + arr[j] === val && i !== j) {
                console.log(`${val} is the sum of ${arr[i]} and ${arr[j]}`)
                return true;
            }
        }
    }
    return false;
}

function calcSums(target) {
    for (let i = 0; i < nums.length; i++) {
        let total = nums[i];
        for (let j = i+1; j < nums.length; j++) {
            total += nums[j];
            if(total > target) {
                break;
            }
            if(total === target) {
                return [i,j];
            }
        }
    }
}

function processArray() {
    for (let i = 0; i < (nums.length + preamble); i++) {

        const currentVal = nums[i + preamble];
        console.log('Checking', currentVal);
        const result = checkNumber(currentVal, nums.slice(i, i + preamble));
        if (!result) {
            return (currentVal);
        }
    }
    return 'Fail!';
}

// console.log(processArray());
const [minIndex, maxIndex] = calcSums(57195069);
const slice = nums.slice(minIndex, maxIndex+1);
const min = Math.min(...slice);
const max = Math.max(...slice);
console.log(min+max); 