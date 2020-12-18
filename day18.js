const fs = require('fs');

const input = fs.readFileSync('./input18.txt', 'utf-8')
    .trim()
    .split('\n')

const rules = [
    { type: 'space', regex: /^\s/ },
    { type: 'lParen', regex: /^\(/ },
    { type: 'rParen', regex: /^\)/ },
    { type: 'number', regex: /^[0-9\.]+/ },
    { type: 'plus', regex: /^\+/ },
    { type: 'mult', regex: /^\*/ },
  ];

  function extractToken(input) {
    for(const rule of rules) {
        const token = rule.regex.exec(input)?.[0];
        if (token) {
            return {
              token,
              type: rule.type,
            };
        }
    }
    throw Error("Unable to extract token");
}

function tokenize(codeListing, currentTokens = []) {
    if(codeListing.length === 0) {
        return currentTokens;
    }

    const result = extractToken(codeListing);

    if(result.type !== 'space') {
        currentTokens.push(result);
    }
    const remainder = codeListing.slice(result.token.length);
   
    return tokenize(remainder, currentTokens);
}

function convertValue(unknown) {
    const num = Number(unknown);
    if(!isNaN(num)){
        return num
    }
    return unknown;
}

function buildAST(tokens) {
    return parseTokens({tokens, ast:[]}).ast;
}

function parseTokens({tokens, ast}) {
    // console.log(tokens);
    let [current, ...remainder] = tokens
   
    if(!current) {
       return {tokens, ast}
    }
    if(current === ")") {
        return {tokens:remainder, ast}
    }
    if(current === "(") {
        const subParse = parseTokens({tokens:remainder, ast:[]});
        current = subParse.ast;
        remainder = subParse.tokens;
    }

    ast.push(convertValue(current))

    return parseTokens({tokens:remainder, ast})
}

function evaluate(AST) {
    const vals = AST.map(e => {
        if(Array.isArray(e)) {
         return evaluate(e)
        }
        return e
    });

    if(vals.length === 1){
        return vals.pop();
    }

    const [x, opp, y, ...rest] = vals; 
    const result = ops[opp](x,y)

    // console.log(x,opp,y, result)
    return evaluate([result, ...rest]);
}

function evaluate2(AST) {
    const vals = AST.map(e => {
        if(Array.isArray(e)) {
         return evaluate2(e)
        }
        return e
    });

    if(vals.length === 1){
        return vals.pop();
    }

    const [x, opp, y, ...rest] = vals; 

    if(opp === '+') {
        console.log(`${x} + ${y}`)
        const result = ops[opp](x,y)
        return evaluate2([result, ...rest]);
    } else if(opp === '*') {
        const result = evaluate2([y, ...rest]);
        console.log(`${x} * ${y}`)
        return ops[opp](x,result)
    }
    
    throw Error('Should never get here');
}

const ops = {
    '+': (x,y) => x + y,
    '*': (x,y) => x * y
}

function run(program, eval) {
    const tokens = tokenize(program)
        .map(token => token.token);
    const ast = buildAST(tokens);
    console.log(ast)
    const result = eval(ast);
    return result
}

function ex1() {
    const evaluated = input.map(x => run(x, evaluate));
    console.log(evaluated)
    return evaluated.reduce((p,c) => p+c);
}
// 9535936849815

function ex2() {
    const evaluated = input.map(x => run(x, evaluate2));
    console.log(evaluated)
    return evaluated.reduce((p,c) => p+c);
}

console.log(ex2())