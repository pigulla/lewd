var util = require('util');

var NestedCondition = require('../NestedCondition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.logic.Not
 * @extends {lewd.condition.NestedCondition}
 * @constructor
 * @param {lewd.condition.ConsumerCondition} condition
 */
function NotCondition(condition) {
    NestedCondition.call(this, 'Not', [condition]);
}

util.inherits(NotCondition, NestedCondition);

/**
 * @inheritdoc
 */
NotCondition.prototype.validate = function (value, path) {
    try {
        this.conditions[0](value, path);
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
