var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

var coercionRegex = /^-?\d+(\.\d+)?$/;

function NumberTypeCondition() {
    Condition.call(this, 'NumberType');
    this.supportsCoercion = true;
}

util.inherits(NumberTypeCondition, Condition);

NumberTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }
    
    if (this.coerce && coercionRegex.test(value)) {
        return parseFloat(value);
    }

    this.reject(value, path, errorMessages.Type, { type: 'number' });
};

module.exports = NumberTypeCondition;
