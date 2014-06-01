var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

function NotCondition(condition) {
    Condition.call(this, 'Not');
    this.condition = condition;
}

util.inherits(NotCondition, Condition);

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
