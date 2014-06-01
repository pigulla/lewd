var util = require('util');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Array,
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    WrongParameterException = require('../../exception/WrongParameterException');

function ArrayCondition (conditions) {
    var lewd = require('../../lewd');
    
    Condition.call(this, 'Array');

    if (!Array.isArray(conditions)) {
        throw new WrongParameterException('Parameter must be an array');
    }

    // avoid the "some" condition if possible to get better error reporting
    if (conditions.length === 0) {
        this.condition = lewd(undefined);
    } else if (conditions.length === 1) {
        this.condition = conditions[0];
    } else {
        this.condition = lewd.all.apply(lewd, conditions);
    }
}

util.inherits(ArrayCondition, Condition);

ArrayCondition.prototype.validate = function (value, path) {
    if (!Array.isArray(value)) {
        this.reject(value, path, errorMessage);
    }

    try {
        value.forEach(function (item, index) {
            this.condition(item, path.concat('#' + index));
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
