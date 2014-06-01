var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessage = require('../../messages').Integer;

function IntegerCondition () {
    var lewd = require('../../lewd');
    
    Condition.call(this, 'Integer');
    
    this.supportsCoercion = true;
    this.condition = lewd.all(Number, lewd(/^-?\d+$/));
    this.coerceCondition = lewd.all(String, /^-?\d+$/);
}

util.inherits(IntegerCondition, Condition);

IntegerCondition.prototype.validate = function (value, path) {
    if (this.coerce) {
        try {
            this.coerceCondition(value, path);
            return parseInt(value, 10);
        } catch (e) {
            /* istanbul ignore else */
            if (e instanceof ConditionViolationException) {
                this.reject(value, path, errorMessage);
            } else {
                throw e;
            }
        }
    } else {
        try {
            return this.condition(value, path);
        } catch (e) {
            /* istanbul ignore else */
            if (e instanceof ConditionViolationException) {
                this.reject(value, path, errorMessage);
            } else {
                throw e;
            }
        }
    }
};

module.exports = IntegerCondition;
