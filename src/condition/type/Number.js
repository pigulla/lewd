var util = require('util');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Type;

/**
 * @class lewd.condition.type.Number
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function NumberTypeCondition() {
    Condition.call(this, 'NumberType');

    this.supportsCoercion = true;
}

util.inherits(NumberTypeCondition, Condition);

/**
 * @inheritdoc
 */
NumberTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }

    this.reject(value, path, errorMessage, { type: 'number' });
};

module.exports = NumberTypeCondition;
