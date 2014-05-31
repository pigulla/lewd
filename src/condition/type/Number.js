var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

var coercionRegex = /^-?\d+(\.\d+)?$/;

function NumberTypeCondition() {
    BaseCondition.call(this, 'NumberType');
    this.supportsCoercion = true;
}

util.inherits(NumberTypeCondition, BaseCondition);

NumberTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'number') {
        return value;
    }
    
    if (this.coerce && coercionRegex.test(value)) {
        return parseFloat(value);
    }

    this.reject(value, path, errorMessages.Type, { type: 'number' });
};
