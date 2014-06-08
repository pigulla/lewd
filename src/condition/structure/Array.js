var util = require('util');

var NestedCondition = require('../NestedCondition'),
    errorMessage = require('../../messages').Array,
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException');

/**
 * @class lewd.condition.content.Array
 * @extends {lewd.condition.NestedCondition}
 * @constructor
 */
function ArrayCondition (conditions) {
    var lewd = require('../../lewd'),
        condition;

    if (!Array.isArray(conditions)) {
        throw new IllegalParameterException('Parameter must be an array');
    }

    if (conditions.length === 0) {
        condition = lewd(undefined);
    } else if (conditions.length === 1) {
        condition = conditions[0];
    } else {
        condition = lewd.all.apply(lewd, conditions);
    }

    NestedCondition.call(this, 'Array', [condition]);
}

util.inherits(ArrayCondition, NestedCondition);

/**
 * @inheritdoc
 */
ArrayCondition.prototype.validate = function (value, path) {
    if (!Array.isArray(value)) {
        this.reject(value, path, errorMessage);
    }

    try {
        value.forEach(function (item, index) {
            value[index] = this.conditions[0](item, path.concat('#' + index));
        }, this);
    } catch (e) {
        if (e instanceof ConditionViolationException) {
            this.reject(value, e.path, e.message);
        } else {
            throw e;
        }
    }

    return value;
};

module.exports = ArrayCondition;
