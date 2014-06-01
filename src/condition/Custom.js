var util = require('util');

var BaseCondition = require('./Base'),
    ConditionViolationException = require('../exception/ConditionViolationException'),
    errorMessages = require('../messages'),
    WrongParameterException = require('../exception/WrongParameterException');

function CustomCondition(fn) {
    BaseCondition.call(this, 'Custom');
    
    if (typeof fn !== 'function') {
        throw new WrongParameterException('Parameter must be a function');        
    }
    
    this.fn = fn;
}

util.inherits(CustomCondition, BaseCondition);

CustomCondition.prototype.validate = function (value, path) {
    var result;
 
    try {
        result = this.fn(value, path);
    } catch (e) {
        if (e instanceof ConditionViolationException) {
            this.reject(value, path, e.message);
        } else {
            throw e;
        }
    }
    
    if (typeof result === 'string') {
        this.reject(value, path, result);
    } else if (result === false) {
        this.reject(value, path, errorMessages.Custom);
    }
    
    return value;
};

module.exports = CustomCondition;
