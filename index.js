var lewd = require('./src/lewd'),
    utils = require('./src/utils');

var boolCond = lewd.condition({
    name: 'BooleanType',
    invoke: function (value) {
        if (!this.coerce && typeof value !== 'boolean') {
            this.reject('Must be of type ${type}', { type: 'BOOL'});
        }
        
        return this.coerce ? !!value : value;
    }
});

var intCond = lewd.condition({
    name: 'Integer',
    invoke: function (value) {
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
    boolCond.coerce = true;
    var v = boolCond.invoke(-1);
    console.info(utils.smartFormat(v));
} catch (e) {
    console.warn(e.name + ': ' + e.message);
    console.dir(e);
}

try {
    intCond.coerce = true;
    intCond.because('I say so!');
    var v = intCond.invoke('x1');
    console.info(utils.smartFormat(v));
} catch (e) {
    console.warn(e.name + ': ' + e.message);
    console.dir(e);
}
