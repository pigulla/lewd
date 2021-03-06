'use strict';

var util = require('util');

var NestedCondition = require('../NestedCondition'),
    ConditionViolationException = require('../../exception/ConditionViolationException');

/**
 * @class lewd.condition.logic.All
 * @extends {lewd.condition.NestedCondition}
 * @constructor
 * @param {Array.<lewd.condition.ConsumerWrapper>} conditions
 */
function AllCondition(conditions) {
    NestedCondition.call(this, 'All', conditions);
}

util.inherits(AllCondition, NestedCondition);

/**
 * @inheritdoc
 */
AllCondition.prototype.validate = function (value, path) {
    if (this._customError) {
        try {
            this._conditions.forEach(function (condition) {
                value = condition(value, path);
            });
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                throw new ConditionViolationException(value, path, this._customError);
            } else {
                throw e;
            }
        }
    } else {
        this._conditions.forEach(function (condition) {
            value = condition(value, path);
        });
    }

    return value;
};

module.exports = AllCondition;
