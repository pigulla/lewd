var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

function StringTypeCondition () {
    Condition.call(this, 'StringType');
    this.supportsCoercion = true;
}

util.inherits(StringTypeCondition, Condition);

StringTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'string') {
        return value;
    }
    
    if (this.coerce) {
        return value + '';
    }

    this.reject(value, path, errorMessages.Type, { type: 'string' });
};

module.exports = StringTypeCondition;
