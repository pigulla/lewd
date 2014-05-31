var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

function StringTypeCondition () {
    BaseCondition.call(this, 'StringType');
    this.supportsCoercion = true;
}

util.inherits(StringTypeCondition, BaseCondition);

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
