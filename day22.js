'use strict'
const players = require('fs').readFileSync(process.argv[2], 'utf-8')
    .trim()
    .split('\n\n')
    .map(player => player
        .split('\n')
        .slice(1)
        .map(Number)
    )

function ex1(players) {
    while(players[0].length !== 0 && players[1].length !== 0) {
        const hand = []
        players.forEach(player => hand.push(player.shift()));
        const winner = hand.indexOf(Math.max(...hand));
        hand.sort((a, b) => b - a).forEach(c => players[winner].push(c));
    }
    return players
        .find(x => x.length > 0)
        .reverse()
        .map((x,i) => x * (i+1))
        .reduce((x,y) => x+y);
}

console.log(ex1(players))