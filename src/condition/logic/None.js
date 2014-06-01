var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages'),
    WrongParameterException = require('../../exception/WrongParameterException');

function NoneCondition(conditions) {
    Condition.call(this, 'None');

    if (!Array.isArray(conditions)) {
        throw new WrongParameterException('Parameter must be an array');
    }

    this.conditions = conditions;
}

util.inherits(NoneCondition, Condition);

NoneCondition.prototype.validate = function (value, path) {
    if (this.conditions.length === 0) {
        return value;
    }

    if (!this.conditions.every(function (condition) {
        try {
            condition(value, path);
            return false;
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                return true;
            } else {
                throw e;
            }
        }
    })) {
        this.reject(value, path, errorMessages.None);
    }

    return value;
};

module.exports = NoneCondition;
