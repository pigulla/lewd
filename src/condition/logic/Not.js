var util = require('util');

var BaseCondition = require('../Base'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

function NotCondition(condition) {
    BaseCondition.call(this, 'Not');
    this.condition = condition;
}

util.inherits(NotCondition, BaseCondition);

NotCondition.prototype.validate = function (value, path) {
    try {
        this.condition(value, path);
    } catch (e) {
        if (e instanceof ConditionViolationException) {
            return value;
        } else {
            throw e;
        }
    }
    
    this.reject(value, path, errorMessages.Not);
};

module.exports = NotCondition;
