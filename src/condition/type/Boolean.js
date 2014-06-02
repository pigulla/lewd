var util = require('util');

var CoercableCondition = require('../CoercableCondition'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.type.Boolean
 * @extends {lewd.condition.CoercableCondition}
 * @constructor
 */
function BooleanTypeCondition () {
    CoercableCondition.call(this, 'BooleanType');
}

util.inherits(BooleanTypeCondition, CoercableCondition);

/**
 * @inheritdoc
 */
BooleanTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'boolean') {
        return value;
    }
    
    if (this.coerce) {
        return !!value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'boolean' });
};

module.exports = BooleanTypeCondition;
