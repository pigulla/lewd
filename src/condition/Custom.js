var util = require('util');

var BaseCondition = require('./Base'),
    ConditionViolationException = require('../exception/ConditionViolationException'),
    errorMessages = require('../messages'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

function CustomCondition(fn) {
    BaseCondition.call(this, 'Custom');
    
    if (typeof fn !== 'function') {
        throw new InvalidSchemaException('Parameter must be a function');        
    }
    
    this.fn = fn;
}

util.inherits(CustomCondition, BaseCondition);

CustomCondition.prototype.validate = function (value, path) {
    var result = this.fn(value, path);
    
    if (typeof result === 'string') {
        this.reject(value, path, result);
    } else if (result === false) {
        this.reject(value, path, errorMessages.Custom);
    }
    
    return value;
};

module.exports = CustomCondition;
