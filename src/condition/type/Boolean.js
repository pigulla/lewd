var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.type.Boolean
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function BooleanTypeCondition() {
    Condition.call(this, 'BooleanType');

    this.supportsCoercion = true;
}

util.inherits(BooleanTypeCondition, Condition);

/**
 * @inheritdoc
 */
BooleanTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'boolean') {
        return value;
    }
    
    if (this._coerce) {
        return !!value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'boolean' });
};

module.exports = BooleanTypeCondition;
