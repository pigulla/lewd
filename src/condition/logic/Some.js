var util = require('util');

var BaseCondition = require('../Base'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

function SomeCondition(conditions) {
    BaseCondition.call(this, 'Some');
    this.conditions = conditions;
}

util.inherits(SomeCondition, BaseCondition);

SomeCondition.prototype.validate = function (value, path) {
    if (this.conditions.length === 0) {
        return value;
    }

    var satisfied = false;

    this.conditions.forEach(function (condition) {
        try {
            condition(value, path);
            satisfied = true;
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                return e;
            } else {
                throw e;
            }
        }
    });

    if (!satisfied) {
        this.reject(value, path, errorMessages.Some);
    }

    return value;
};

module.exports = SomeCondition;
