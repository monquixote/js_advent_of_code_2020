/*
To transform a subject number, start with the value 1. Then, a number of times called the loop size, perform the following steps:

Set the value to itself multiplied by the subject number.
Set the value to the remainder after dividing the value by 20201227.
*/

const publicKeys = [6929599, 2448427]

const sampleKeys = [5764801, 17807724]

function nextValue(value, subjectNumber) {
    value = value * subjectNumber
    return value % 20201227
}

function transformInput(loopSize, value, subjectNumber, keys) {
    const loopSizes = [[],[]]
    for (let i = 0; i < loopSize; i++) {
        value = nextValue(value, subjectNumber)
        const keyIndex = keys.findIndex(x => x === value)
        if (keyIndex !== -1) {
            loopSizes[keyIndex].push(i + 1)
        }
    }
    return loopSizes
}

function calculateKey(loopSize, value, subjectNumber) {
    for (let i = 0; i < loopSize; i++) {
        value = nextValue(value, subjectNumber)
    }
    return value
}


const keys = transformInput(10000000, 1, 7, sampleKeys)
console.log(calculateKey(keys[0][0], 1, sampleKeys[1]))
console.log(calculateKey(keys[1][0], 1, sampleKeys[0]))

const keys2 = transformInput(100000000, 1, 7, publicKeys)
console.log(calculateKey(keys2[0][0], 1, publicKeys[1]))
console.log(calculateKey(keys2[1][0], 1, publicKeys[0]))