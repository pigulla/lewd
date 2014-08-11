var util = require('util');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Type;

/**
 * @class lewd.condition.type.Null
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function NullTypeCondition() {
    Condition.call(this, 'NullType');
}

util.inherits(NullTypeCondition, Condition);

/**
 * @inheritdoc
 */
NullTypeCondition.prototype.validate = function (value, path) {
    if (value === null) {
        return value;
    }

    this.reject(value, path, errorMessage, { type: 'null' });
};

module.exports = NullTypeCondition;
