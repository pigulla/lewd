var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages'),
    IllegalParameterException = require('../../exception/IllegalParameterException');

/**
 * @class lewd.condition.logic.None
 * @extends {lewd.condition.Condition}
 * @param {Array.<lewd.condition.ConsumerCondition>} conditions
 * @constructor
 */
function NoneCondition(conditions) {
    Condition.call(this, 'None');

    if (!Array.isArray(conditions)) {
        throw new IllegalParameterException('Parameter must be an array');
    }

    this.conditions = conditions;
}

util.inherits(NoneCondition, Condition);

/**
 * @inheritdoc
 */
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
