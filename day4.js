const fs = require('fs');

const content = fs.readFileSync('./input4.txt','utf-8');

console.log(content);

const lines = content.split('\n');

const records = lines.reduce((p,c) => {
    if(c.length === 0) {
        p.push({});
        return p;
    }
    const last = p[p.length-1];
    c.split(" ").forEach(pair => {
        const [key,val] = pair.split(':');
        last[key] = val;
    });
    return p;
},[{}]);

console.log(records);

const reqFields = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
   // "cid"
];

const heightValidator = (height) => {
    const unit = height.slice(-2);
    const num = parseInt(height);
    if(unit === 'cm') {
        return num >= 150 && num <=193;
    }
    if(unit === 'in') {
        return num >= 59 && num <= 76;
    }
    false;
}

const hairValidator = (hair) => {
    return /^#[0-9A-F]{6}$/i.test(hair);
};

const eyeCols = [
    'amb', 
    'blu', 
    'brn', 
    'gry', 
    'grn', 
    'hzl', 
    'oth'
];

const eyeValidator = (eye) => {
    return eyeCols.includes(eye);
}

const passportValidator = (passport) => {
    return passport.length === 9 && !isNaN(passport);
}

const validators = {
    byr:x => x >= 1920 && x <= 2002,
    iyr:x => x >= 2010 && x <=2020,
    eyr:x => x.length === 4 && x>= 2020 && x<= 2030,
    hgt:x => heightValidator(x),
    hcl:x => hairValidator(x),
    ecl:x => eyeValidator(x),
    pid:x => passportValidator(x),
    cid:x => true
}

const valid = records.filter(rec => reqFields.every(field => Object.keys(rec).includes(field)));

console.log(valid.length);

const valid2 = valid.filter(rec => {
    return Object.keys(rec).every(key => validators[key](rec[key]));
})

console.log(valid2.length);