var util = require('util');

var Condition = require('./Condition'),
    IllegalParameterException = require('../exception/IllegalParameterException');

/**
 * @abstract
 * @class lewd.condition.NestedCondition
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {string} name
 * @param {Array.<lewd.condition.ConsumerWrapper>} conditions
 */
function NestedCondition(name, conditions) {
    Condition.call(this, name);

    if (!Array.isArray(conditions)) {
        throw new IllegalParameterException('Parameter must be an array');
    }

    this._conditions = conditions;
}

util.inherits(NestedCondition, Condition);

/**
 * @protected
 * @private
 * @type {Array.<lewd.Condition.ConsumerWrapper>}
 */
NestedCondition.prototype._conditions = null;

/**
 * @inheritdoc
 */
NestedCondition.prototype.lock = function () {
    this._conditions.forEach(function (condition) {
        condition.lock();
    });
    return this;
};

/**
 * @inheritdoc
 */
NestedCondition.prototype.find = function (name) {
    var result = Condition.prototype.find.call(this, name);

    this._conditions.forEach(function (condition) {
        result = result.concat(condition.find(name));
    });

    return result;
};

module.exports = NestedCondition;
