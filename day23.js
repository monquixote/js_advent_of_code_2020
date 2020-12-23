'use strict'
const cups = '198753462'.split('').map(Number);
const cups2 = '389125467'.split('').map(Number); // Demo input

function cupsToLinked(initialCups) {
    const cups = [];
    for (let i = 0; i < initialCups.length; i++) {
        cups[initialCups[i] - 1] = initialCups[(i + 1) % initialCups.length] - 1;
    }
    return cups
}

function next3(cups, i) {
    const next = []
    let current = i
    for (let i = 0; i < 3; i++) {
        next.push(cups[current])
        current = cups[current];
    }
    return next
}

function getDestinationCup(removed, currentCup, max) {
    let destination = currentCup - 1;
    if (destination === -1) {
        destination = max;
    }
    if (removed.includes(destination)) {
        destination = getDestinationCup(removed, destination, max)
    }
    return destination
}

function ex1(initialCups, iterations) {
    let currentCup = initialCups[0] - 1;
    const cups = cupsToLinked(initialCups);
    for (let i = 0; i < iterations; i++) {
        const removed = next3(cups, currentCup);
        const destination = getDestinationCup(removed, currentCup, cups.length - 1);
        const [firstR, _, lastR] = removed
        cups[currentCup] = cups[lastR]
        cups[lastR] = cups[destination]
        cups[destination] = firstR
        currentCup = cups[currentCup];
    }
    return cups
}

function linkedToCups(linked) {
    const cups = [];
    let next = 0;
    for (let i = 0; i < linked.length; i++) {
        cups.push(linked[next] + 1)
        next = linked[next]
    }
    return cups.join('').slice(0, -1)
}

function genEx2(cups) {
    const output = [...cups]
    for (let i = output.length; i < 1000000; i++) {
        output.push(i + 1);
    }
    return output
}

function ex2Ans(cups) {
    return (cups[0] + 1) * (cups[cups[0]] + 1)
}

console.log(linkedToCups(ex1(cups, 100)))
console.log(ex2Ans(ex1(genEx2(cups), 10000000)));