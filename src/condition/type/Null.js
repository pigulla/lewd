var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

function NullTypeCondition () {
    Condition.call(this, 'NullType');
}

util.inherits(NullTypeCondition, Condition);

NullTypeCondition.prototype.validate = function (value, path) {
    if (value === null) {
        return value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'null' });
};

module.exports = NullTypeCondition;
