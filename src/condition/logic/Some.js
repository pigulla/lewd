var util = require('util');

var NestedCondition = require('../NestedCondition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.logic.Some
 * @extends {lewd.condition.NestedCondition}
 * @constructor
 * @param {Array.<lewd.condition.ConsumerWrapper>} conditions
 */
function SomeCondition(conditions) {
    NestedCondition.call(this, 'Some', conditions);
}

util.inherits(SomeCondition, NestedCondition);

/**
 * @inheritdoc
 */
SomeCondition.prototype.validate = function (value, path) {
    if (this._conditions.length === 0) {
        return value;
    }

    var satisfied = false;

    this._conditions.forEach(function (condition) {
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
