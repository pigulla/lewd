var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');
    
function BooleanTypeCondition () {
    Condition.call(this, 'BooleanType');
    this.supportsCoercion = true;
}

util.inherits(BooleanTypeCondition, Condition);

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
