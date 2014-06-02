var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException');

/**
 * @class lewd.condition.logic.All
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {Array.<lewd.condition.ConsumerCondition>} conditions
 */
function AllCondition(conditions) {
    Condition.call(this, 'All');

    if (!Array.isArray(conditions)) {
        throw new IllegalParameterException('Parameter must be an array');
    }

    this.conditions = conditions;
}

util.inherits(AllCondition, Condition);

/**
 * @inheritdoc
 */
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
