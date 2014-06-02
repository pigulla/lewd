var util = require('util');

var CoercableCondition = require('../CoercableCondition'),
    errorMessage = require('../../messages').Type;

var coercionRegex = /^-?\d+(\.\d+)?$/;

/**
 * @class lewd.condition.type.Number
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function NumberTypeCondition() {
    CoercableCondition.call(this, 'NumberType');
}

util.inherits(NumberTypeCondition, CoercableCondition);

/**
 * @inheritdoc
 */
NumberTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }
    
    if (this.coerce && coercionRegex.test(value)) {
        return parseFloat(value);
    }

    this.reject(value, path, errorMessage, { type: 'number' });
};

module.exports = NumberTypeCondition;
