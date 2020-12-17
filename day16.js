const fs = require('fs');

const content = fs.readFileSync('./input16.txt', 'utf-8');

const [rulesRaw, myTicketRaw, ticketsRaw] = content
    .trim()
    .split('\n')
    .reduce((arrays, line) => {
        if (line.length === 0) {
            arrays.push([]);
        } else {
            arrays[arrays.length - 1].push(line);
        }
        return arrays;
    }, [[]])

const myTicket = myTicketRaw.slice(1).map(line => line.split(',').map(x => Number(x)));
const tickets = ticketsRaw.slice(1).map(line => line.split(',').map(x => Number(x)));

const rules = rulesRaw.map(line => {
    const [name, ranges] = line.split(':');
    const [min1, max1, min2, max2] = ranges.split('or')
        .flatMap(x => x.trim().split('-')).map(x => Number(x));
    return {
        name,
        min1,
        max1,
        min2,
        max2
    }
});

// console.log(rules);

function validateField(field, rule) {
    return (field >= rule.min1 && field <= rule.max1) ||
        (field >= rule.min2 && field <= rule.max2)
}

function validateTicket(ticket) {
    return ticket.every(field =>
        rules.some(rule =>
            validateField(field, rule)
        )
    )
}

function ex1() {
    const invalidFields = []
        .concat(...tickets)
        .filter(field => !rules.some(rule => validateField(field, rule)));

    return invalidFields.reduce((p, c) => p + c);
}

function constrainChoices(arr) {
    const sets = arr.map(x => new Set(x));
    const answers = {};
    while(true) {

        const i = sets.findIndex(x => x.size === 1);
        if(i === -1) {
            return answers;
        }
        const toRemove = sets[i].values().next().value;
        answers[i] = toRemove;
        sets.forEach(x => x.delete(toRemove));
    }
}

function ex2() {
    const validTickets = tickets.filter(validateTicket);

    const fields = [];
    for (let i = 0; i < validTickets[i].length; i++) {
        fields.push(validTickets.map(x => x[i]));
    }

    const potentials = fields.map(arr => {
        const potentialFields = []
        for(rule of rules) {
            if(arr.every(x => validateField(x, rule))) {
                potentialFields.push(rule.name);
            }
        }
        return potentialFields;
    })

    const constrained = constrainChoices(potentials);
    const fieldsToMult = Object.entries(constrained)
        .filter(([k,v]) => v.includes('departure'))
        .map(x => x[0]);
    console.log(myTicket[0].length)
    return fieldsToMult.reduce((p,c) => p * myTicket[0][c],1);
}

console.log(ex2());