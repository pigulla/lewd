var util = require('util');

var Condition = require('./Condition'),
    IllegalParameterException = require('../exception/IllegalParameterException');

/**
 * @abstract
 * @class lewd.condition.NestedCondition
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {string} name
 * @param {Array.<lewd.condition.ConsumerCondition>} conditions
 */
function NestedCondition(name, conditions) {
    Condition.call(this, name);

    if (!Array.isArray(conditions)) {
        throw new IllegalParameterException('Parameter must be an array');
    }

    this.conditions = conditions;
}

util.inherits(NestedCondition, Condition);

/**
 * @protected
 * @type {Array.<lewd.Condition.ConsumerCondition>}
 */
NestedCondition.prototype.conditions = null;

/**
 * @inheritdoc
 */
NestedCondition.prototype.find = function (name) {
    var result = Condition.prototype.find.call(this, name);

    this.conditions.forEach(function (condition) {
        result = result.concat(condition.find(name));
    });

    return result;
};

module.exports = NestedCondition;
