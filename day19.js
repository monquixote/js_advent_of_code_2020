const fs = require('fs');

const [ruleStrings, input] = fs.readFileSync(process.argv[2], 'utf-8')
    .trim()
    .split('\n')
    .reduce((arr, c) => {
        if (c.length === 0) {
            arr.push([]);
        } else {
            arr[arr.length - 1].push(c)
        }
        return arr;
    }, [[]])

const inputArrs = input.map(x => x.split(''));

function createCharMatcher(potential) {
    if (!isNaN(Number(potential)) || potential.length !== 3) {
        throw Error(`Input ${potential} not expected ${potential.length}`)
    }
    const char = potential.slice(1, 2);
    return ([head, ...tail]) => {
        if (head === char) {
            return tail
        }
        return false
    }
}

function createRuleMatcher(ruleList, ruleBook) {
    return (input) => {
        let remainder = input
        for (let i = 0; i < ruleList.length; i++) {
            remainder = ruleBook[ruleList[i]](remainder)
           
            if (remainder === false || remainder === true) {
                return remainder;
            }
            
            if ( remainder.length === 0) {
                if(i !== ruleList.length -1) {
                    return false;
                }
                return true;
            }
        }
        return remainder;
    }
}

function processClause(clauseStr, ruleBook) {
    // If there is no second rule it's equivalent to always 'false'
    if (!clauseStr) {
        return () => {
            return false;
        }
    }
    const ruleList = clauseStr
        .trim()
        .split(' ')
    if (ruleList.length === 1 && isNaN(Number(ruleList[0]))) {
        const potential = ruleList[0];
        return createCharMatcher(potential)
    }
    return createRuleMatcher(ruleList, ruleBook)
}

function processRule(rule, ruleBook) {
    const [ruleNo, rest] = rule.split(':')
    const [first, second] = rest.split('|')
    const func1 = processClause(first, ruleBook)
    const func2 = processClause(second, ruleBook)
    ruleBook[ruleNo] = (input) => {
        const result = func1(input, ruleBook)
        if (result !== false) {
            return result;
        }
        return func2(input, ruleBook)
    }
}

function createRules(ruleStrings) {
    const ruleBook = {}
    ruleStrings.forEach(str => processRule(str, ruleBook));
    return ruleBook
}

function checkAgainstRules(inputArr, ruleBook) {
    const result = ruleBook['0'](inputArr);
    if (result === true) {
    }
    return result
}

const myRules = createRules(ruleStrings);
const results = inputArrs.map(x => checkAgainstRules(x, myRules));
console.log(results.filter(x => x === true).length)

// Ex1 ans 178
// Ex2 ans 346