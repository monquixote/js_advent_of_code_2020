const fs = require('fs');

const [rules, messages] = fs.readFileSync(process.argv[2], 'utf-8')
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

const ruleBook = rules
    .map(rule => rule.split(": "))
    .reduce(
        (map, [ruleName, r]) => {
            const value = r[0] === '"' ? r[1] : r.split(" | ").map(n => n.split(" "))
            return map.set(ruleName, value)
        },
        new Map()
    );

function validate(msg, [rule, ...rest]) {
    if(!rule) {
        return !msg;
    }
    if (!msg) {
        return !rule;
    }
    const next = ruleBook.get(rule);
    if(Array.isArray(next)){
        return next.some(r => validate(msg, r.concat(rest)))
    } else {
        if(msg.slice(0,1) !== next){
            return false;
        }
        return validate(msg.slice(1), rest);
    }
};

function ex1(messages) {
    return messages
        .map(message => ruleBook.get("0")
        .some(rule => validate(message, rule)))
        .filter(x => x).length;
};

console.log(ex1(messages))
