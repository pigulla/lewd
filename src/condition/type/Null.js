var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

function NullTypeCondition () {
    BaseCondition.call(this, 'NullType');
}

util.inherits(NullTypeCondition, BaseCondition);

NullTypeCondition.prototype.validate = function (value, path) {
    if (value === null) {
        return value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'null' });
};

module.exports = NullTypeCondition;
