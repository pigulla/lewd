var util = require('util');

var lewd = require('./src/lewd'),
    utils = require('./src/utils'),
    BaseCondition = require('./src/condition/Base');







try {
    var boolCond = new BooleanTypeCondition(),
        regexCond = new RegexCondition(/^f/),
        allCond = new AllCondition([boolCond, regexCond]);
    
    boolCond.enableCoercion(true);
    var v = allCond.validate(0);
    console.info(utils.smartFormat(v));
} catch (e) {
    console.warn(e.name + ': ' + e.message);
    console.dir(e);
}

return;

var regexCond = lewd.condition({
    name: 'Regex',
    validate: function (value) {
        if (!this.options.regex.test(value)) {
            this.reject('Does not match the regex');
        }
        
        return value;
    }
});

var allCond = lewd.condition({
    name: 'All',
    validate: function (value) {
        if (typeof value === 'number' && /^-?\d+$/.test(value)) {
            return value;
        }
        
        if (this.coerce && typeof value === 'string' && /^-?\d+$/.test(value)) {
            return parseInt(value, 10);
        }

        this.reject('Not a valid integer');
    }
});

var intCond = lewd.condition({
    name: 'Integer',
    validate: function (value) {
        if (typeof value === 'number' && /^-?\d+$/.test(value)) {
            return value;
        }
        
        if (this.coerce && typeof value === 'string' && /^-?\d+$/.test(value)) {
            return parseInt(value, 10);
        }

        this.reject('Not a valid integer');
    }
});

try {
    var v = regexCond.validate(-1);
    console.info(utils.smartFormat(v));
} catch (e) {
    console.warn(e.name + ': ' + e.message);
    console.dir(e);
}
/*
try {
    boolCond.coerce = true;
    var v = boolCond.validate(-1);
    console.info(utils.smartFormat(v));
} catch (e) {
    console.warn(e.name + ': ' + e.message);
    console.dir(e);
}

try {
    intCond.coerce = true;
    intCond.because('I say so!');
    var v = intCond.validate('x1');
    console.info(utils.smartFormat(v));
} catch (e) {
    console.warn(e.name + ': ' + e.message);
    console.dir(e);
}
*/
