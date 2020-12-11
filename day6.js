const fs = require('fs');

const content = fs.readFileSync('./input6.txt','utf-8');

const groups = content
    .split('\n')
    .reduce((p,c) => {
        if(c.length === 0){
            p.push([]);
        } else {
            p[p.length - 1].push(c.split(''));
        }
        return p;
    },[[]])

function processGroup(group) {
    const set = group.reduce((set,str) => {
        str.forEach(chr => {
            set.add(chr);
        });
        return set;
    }, new Set());
    return set;
}

function processGroup2(group) {
    return group.reduce((oldArr,chars) => {
        const newArr = [];
        chars.forEach(chr => {
            if(oldArr.includes(chr)) {
                newArr.push(chr);
            }
        });
        return newArr;
    });
}

const count = groups
    .map(processGroup)
    .map(set => set.size)
    .reduce((p,c) => p + c);

const count2 = groups
    .filter(arr => arr.length > 0)
    .map(processGroup2)
    .map(arr => arr.length)
    .reduce((p,c) => p + c);

console.log(count);
console.log(count2);