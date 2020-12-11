const fs = require('fs');

const content = fs.readFileSync('./input8.txt', 'utf-8');

const baseInstructions = content
    .trim()
    .split('\n')
    .map(line => {
        const [cmd, val] = line.split(' ');
        return { cmd, val: parseInt(val) };
    })

function testFunction(instructions) {

    const seen = new Set();
    let accVal = 0;
    let pc = 0;

    const funcs = {
        acc: (val) => {
            accVal += val;
            pc += 1;
        },
        nop: () => pc += 1,
        jmp: (val) => pc += val
    };


    function executeCode() {
        while (!seen.has(pc)) {
            seen.add(pc);
            const { cmd, val } = instructions[pc];
            // console.log(cmd, val, pc);
            funcs[cmd](val);
            if(pc === instructions.length) {
                return accVal;
            }
        }

        return null;
    }

    return executeCode();
}

const jmpToNop = (x) => x === 'nop' ? 'jmp' : 'nop';

for (i = 0; i < baseInstructions.length; i++) {
    const currIns = [...baseInstructions];
    if(baseInstructions[i].cmd === 'acc') {
        continue;
    }
    currIns[i] = {
        val: currIns[i].val,
        cmd: jmpToNop(currIns[i].cmd)
    }

    const result = testFunction(currIns);
    if(result !== null) {
        console.log('Win', result);
        break;
    }
}


function oldTestFunction(instructions) {

    const seen = new Set();
    let accVal = 0;
    let pc = 0;

    const funcs = {
        acc: (val) => {
            accVal += val;
            pc += 1;
        },
        nop: () => pc += 1,
        jmp: (val) => pc += val
    };


    function executeCode() {
        while (!seen.has(pc)) {
            seen.add(pc);
            const { cmd, val } = instructions[pc];
            funcs[cmd](val);
        }

        console.log('Done acc = ', accVal);
    }

    executeCode()
}