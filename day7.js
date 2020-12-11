const fs = require('fs');

const content = fs.readFileSync('./input7.txt','utf-8');

const bagRules = {};

const bags = content
    .split('\n')
    .filter(line => line.length > 0)
    .forEach(processBag)

function processBag(bag) {
    const [bagName, restStr ] = bag.split('contain');
    const [adj, colour, bags ] = bagName.split(' ')
    const bagKey = adj+colour;
    // console.log( bagName, restStr)
    if(restStr.includes('no other bags')) {
        bagRules[bagKey] = [];
        return;
    }
    const rest = restStr
        .split(',')
        .map(entry => {
         const words = entry.split(' ');
         return [ words[2]+words[3], words[1] ];
        });
    bagRules[bagKey] = rest;
}

function containsShinyGold(key) {
    if(key === 'shinygold'){
        return true;
    }
    const contains = bagRules[key].map(x => x[0]);
   
    return contains.some(containsShinyGold);
}

function countBags(key) {
    // console.log(key);
    const bag = bagRules[key];
    if(bag.length === 0) {
        return 0;
    }
    const bagNos = bagRules[key].map(x => (countBags(x[0])+1) * x[1]);
    const sum = bagNos.reduce((p,c) => p+c);
    return sum;
}

/*
const result = Object.keys(bagRules)
    .filter(containsShinyGold)

console.log(result.length-1);
*/
console.log(bagRules);
console.log(countBags('shinygold'))