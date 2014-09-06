var util = require('util');

var NestedCondition = require('../NestedCondition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.logic.None
 * @extends {lewd.condition.NestedCondition}
 * @constructor
 * @param {Array.<lewd.condition.ConsumerWrapper>} conditions
 */
function NoneCondition(conditions) {
    NestedCondition.call(this, 'None', conditions);
}

util.inherits(NoneCondition, NestedCondition);

/**
 * @inheritdoc
 */
NoneCondition.prototype.validate = function (value, path) {
    if (this._conditions.length === 0) {
        return value;
    }

    if (!this._conditions.every(function (condition) {
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
