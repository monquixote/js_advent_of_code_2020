const fs = require('fs');

const content = fs.readFileSync('./input13.txt', 'utf-8');

const lines = content
    .trim()
    .split('\n')

const initialTS = Number(lines[0]);

const busTimes = lines[1]
    .split(',')
    .filter(x => x !== 'x')
    .map(x => Number(x));

function checkTimes(startingTime, arr) {
    let time = startingTime
    let done = false
    while (!done) {
        for (let i = 0; i < arr.length; i++) {
            if (time % arr[i] === 0) {
                return [arr[i], time];
            }
        }
        time++
    }
}

// const [busNo, departTime] = checkTimes(initialTS, busTimes)
// console.log(busNo, departTime, (departTime - initialTS) * busNo)
// ans 17 1000059 119

const busTimes2 = lines[1]
    .split(',')

const offsets = [];

for (let i = 0; i < busTimes2.length; i++) {
    if (busTimes2[i] !== 'x') {
        offsets.push([Number(busTimes2[i]), i]);
    }
}

// console.log(offsets);

function offsetCheck(time, arr) {
    return arr.every(([freq, offset]) => (time + offset) % freq === 0)
}


let last = 0

function offsetCheck2(time, arr) {
    const total = arr.reduce((count,[freq, offset]) => (time + offset) % freq === 0 ? count+1:count,0);
    /*
    if(total > 2) {
        console.log(time, time - last, total)
        last = time
    }
    */
    if(total === arr.length) {
        return true;
    }
    return false;
}

let step = 1;
let check = 2;
function ex2() {
    let done = false; 
    let time = 0
    let last = 0;
    let found = false;
    while(!done) {
        if(offsetCheck2(time, offsets.slice(0,check))) {
            console.log('Found', time, check, time - last);
            if(check === offsets.length) {
                return time;
            }
            if(!found) {
                found = true;
                last = time;
            } else {
                check++;
                step = time - last
                last = time;
                found = false;
            }
        }
        time += step;
    }
}

console.log(ex2());

// ans 1106724616194525