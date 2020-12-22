'use strict'
const fs = require('fs');

const input = fs.readFileSync(process.argv[2], 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
        const [inStr, alStr] = line.split(' (contains ')
        const ingredients = inStr.split(' ')
        const alergens = alStr.slice(0, -1).split(', ')
        return [ingredients, alergens];
    })

const allergens = input.reduce((set, row) =>
    row[1].reduce((p, c) => p.add(c), set)
    , new Set());

function intersection(array1, array2) {
    return array1.filter(value => array2.includes(value));
}

function findCommonElements(input, allergen) {
    const potentials = input
        .filter(x => x[1].includes(allergen))
        .map(x => x[0]);

    return potentials.reduce((p, c) => intersection(p, c))
}


const commonElements = Array.from(allergens)
    .reduce((map, allergen) => map.set(allergen, findCommonElements(input, allergen)), new Map())

function removeElement(array, element) {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function constrainPotentials(potentials) {
    const answers = new Map();
    while (potentials.size > 0) {
        const knowns = Array.from(potentials.entries())
            .filter(([k, v]) => v.length === 1)

        knowns.forEach(known => {
            const [allergen, [ingredient]] = known;
            answers.set(allergen, ingredient)
            potentials.delete(allergen);
            potentials.forEach(arr => removeElement(arr, ingredient));
        });
    }
    return answers
}

const answers = constrainPotentials(commonElements)

const allergenIngredients = Array.from(answers.values());

console.log(allergenIngredients)

const flattenedIngredients = input
    .map(x => x[0])
    .flat()
    .filter(x => !allergenIngredients.includes(x))

console.log(flattenedIngredients.length)

const list = Array.from(answers.entries())
    .sort((a, b) => {
        if(a[0] < b[0]) { return -1; }
        if(a[0] > b[0]) { return 1; }
        return 0;
    })
    .map(x => x[1])
    .join(',')

console.log(list);