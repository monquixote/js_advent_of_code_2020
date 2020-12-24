'use strict'
const cups = '198753462'.split('').map(Number);
const cups2 = '389125467'.split('').map(Number);

function removeCups(cups, currentCup) {
    const cupIndex = cups.findIndex(n => n === currentCup);
    const toRemove = [1, 2, 3].map(n => (n + cupIndex) % cups.length)
    const removed = toRemove.map(n => cups[n]);
    const retained = cups.filter(cup => !removed.includes(cup));
    return [removed, retained]
}

function getDestinationCup(remainingCups, currentCup) {
    let maybeDest = currentCup - 1
    while (maybeDest > 0) {
        if (remainingCups.includes(maybeDest)) {
            return maybeDest
        }
        maybeDest--
    }
    return arrayMax(remainingCups)
}

function addCups(retained, removed, destinationCup) {
    const destinationIndex = retained.findIndex(n => n === destinationCup)
    retained.splice(destinationIndex + 1, 0, ...removed)
    return retained
}

function nextCurrent(cups, currentCup) {
    const index = cups.findIndex(n => n === currentCup)
    const nextIndex = (index + 1) % cups.length
    return cups[nextIndex];
}

function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
  };

function ex1(initialCups, iterations) {
    let cups = initialCups;
    let currentCup = cups[0]
    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        if(i % 100 === 0) {
            console.log('Percent: '+(i / iterations * 100))
            console.log('ETA Hours: ' + (Date.now() - start) / i * iterations / 1000 / 3600)
        }
        const [removed, retained] = removeCups(cups, currentCup)
        // console.log(`Removed ${removed} retained ${retained}, Current ${currentCup}`)
        const destination = getDestinationCup(retained, currentCup)
        cups = addCups(retained, removed, destination)
        // console.log(cups)
        currentCup = nextCurrent(cups, currentCup)
    }
    return cups
}

function genOutputStr2(cups) {
    const answer = []
    const index = cups.findIndex(n => n === 1);
    [0,1,2].forEach(i => {
        answer.push(cups[index+i])
    });
    return answer
}

function genOutputStr(cups) {
    const answer = []
    const index = cups.findIndex(n => n === 1)
    for (let i = 1; i < cups.length; i++) {
        answer.push(cups[(i + index) % cups.length])
    }
    return answer.join('')
}

function genEx2(cups) {
    const output = [...cups]
    for(let i = output.length ; i < 1000000; i++){
        output.push(i);
    }
    return output
}


  console.log(genOutputStr(ex1(cups, 100)))
 // 62934785

 // This solution should be able to solve part two, but would take about a week!