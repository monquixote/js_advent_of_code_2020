'use strict'
const players = require('fs').readFileSync(process.argv[2], 'utf-8')
    .trim()
    .split('\n\n')
    .map(player => player
        .split('\n')
        .slice(1)
        .map(Number)
    )

function calculateWinningScore(player) {
    return player
        .reverse()
        .map((x, i) => x * (i + 1))
        .reduce((x, y) => x + y);
}

function ex1(players) {
    while (players.every(player => player.length > 0)) {
        const hand = []
        players.forEach(player => hand.push(player.shift()));
        const winner = hand.indexOf(Math.max(...hand));
        hand.sort((a, b) => b - a).forEach(c => players[winner].push(c));
    }
    return calculateWinningScore(players .find(x => x.length > 0))
}

function ex2(players) {
    const history = new Set()
    let winner = null
    while (players.every(player => player.length > 0)) {
        if (history.has(JSON.stringify(players))) {
            return [0, players]
        }
        history.add(JSON.stringify(players));
        const hand = []
        players.forEach(player => hand.push(player.shift()));
        winner = hand.indexOf(Math.max(...hand));
        if (hand.every((c, i) => c <= players[i].length)) {
            const subGamePlayers = players
                .map((player, i) => player.slice(0, hand[i]));
            [winner] = ex2(subGamePlayers);
        }
        if(winner == 1) {
            hand.reverse()
        }
        hand.forEach(c => players[winner].push(c));
    }
    return [winner, players]
}

console.log(ex1(players));
// Ans 34664
const [winner, hands] = ex2(players);
console.log(winner, hands);
console.log(calculateWinningScore(hands[winner]));
// Ans 32018