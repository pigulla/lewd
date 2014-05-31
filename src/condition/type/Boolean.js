var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');
    
function BooleanTypeCondition () {
    BaseCondition.call(this, 'BooleanType');
    this.supportsCoercion = true;
}

util.inherits(BooleanTypeCondition, BaseCondition);

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
