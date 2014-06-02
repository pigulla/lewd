var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessage = require('../../messages').Integer;

/**
 * @class lewd.condition.composite.Integer
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function IntegerCondition() {
    Condition.call(this, 'Integer');

    this.supportsCoercion = true;
}

util.inherits(IntegerCondition, Condition);

/**
 * @inheritdoc
 */
IntegerCondition.prototype.validate = function (value, path) {
    if (typeof value === 'number') {
        if (/^-?\d+$/.test(value)) {
            return value;
        } else if (this.coerce) {
            return Math.round(value);
        } else {
            this.reject(value, path, errorMessage);
        }
    }
    
    if (!this.coerce) {
        this.reject(value, path, errorMessage);
    }
    
    if (typeof value === 'string' && /^-?\d+$/.test(value)) {
        return parseInt(value, 10);
    }

    this.reject(value, path, errorMessage);
};

module.exports = IntegerCondition;
