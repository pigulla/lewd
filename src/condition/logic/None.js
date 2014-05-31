var util = require('util');

var BaseCondition = require('../Base'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

function NoneCondition(conditions) {
    BaseCondition.call(this, 'None');
    this.conditions = conditions;
}

util.inherits(NoneCondition, BaseCondition);

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
