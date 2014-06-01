var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

function ArrayTypeCondition () {
    Condition.call(this, 'ArrayType');
}

util.inherits(ArrayTypeCondition, Condition);

ArrayTypeCondition.prototype.validate = function (value, path) {
    if (Array.isArray(value)) {
        return value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'array' });
};

module.exports = ArrayTypeCondition;
