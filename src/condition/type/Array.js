var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

function ArrayTypeCondition () {
    BaseCondition.call(this, 'ArrayType');
}

util.inherits(ArrayTypeCondition, BaseCondition);

ArrayTypeCondition.prototype.validate = function (value, path) {
    if (Array.isArray(value)) {
        return value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'array' });
};

module.exports = ArrayTypeCondition;
