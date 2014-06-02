var util = require('util');

var CoercableCondition = require('../CoercableCondition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessage = require('../../messages').Integer;

/**
 * @class lewd.condition.composite.Integer
 * @extends {lewd.condition.CoercableCondition}
 * @constructor
 */
function IntegerCondition() {
    var lewd = require('../../lewd'),
        strict = lewd.all(Number, lewd(/^-?\d+$/)),
        coercable = lewd.all(String, /^-?\d+$/);

    CoercableCondition.call(this, 'Integer', strict, coercable);
}

util.inherits(IntegerCondition, CoercableCondition);

/**
 * @inheritdoc
 */
IntegerCondition.prototype._coerce = function (value) {
    return parseInt(value, 10);
};
    
/**
 * @inheritdoc
 */
IntegerCondition.prototype.validate = function (value, path) {
    return CoercableCondition.prototype.validate.call(this, value, path, errorMessage);
};

module.exports = IntegerCondition;
