var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages'),
    WrongParameterException = require('../../exception/WrongParameterException');

function AllCondition(conditions) {
    Condition.call(this, 'All');

    if (!Array.isArray(conditions)) {
        throw new WrongParameterException('Parameter must be an array');
    }

    this.conditions = conditions;
}

util.inherits(AllCondition, Condition);

AllCondition.prototype.validate = function (value, path) {
    if (this.customError) {
        try {
            this.conditions.forEach(function (condition) {
                value = condition(value, path);
            });
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                throw new ConditionViolationException(value, path, this.customError);
            } else {
                throw e;
            }
        }
    } else {
        this.conditions.forEach(function (condition) {
            value = condition(value, path);
        });
    }

    return value;
};

module.exports = AllCondition;
