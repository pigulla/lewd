var util = require('util');

var BaseCondition = require('../Base'),
    AllCondition = require('../logic/All'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    NumberTypeCondition = require('../type/Number'),
    RegexCondition = require('../content/Regex'),
    errorMessages = require('../../messages');

// TODO: add coercion support

function IntegerCondition () {
    BaseCondition.call(this, 'Integer');
    
    this.condition = new AllCondition([
        (new NumberTypeCondition()).consumer(),
        (new RegexCondition(/^-?\d+$/)).consumer()
    ]);
}

util.inherits(IntegerCondition, BaseCondition);

IntegerCondition.prototype.validate = function (value, path) {
    try {
        this.condition.validate(value, path);
        return value;
    } catch (e) {
        if (e instanceof ConditionViolationException) {
            this.reject(value, path, errorMessages.Integer);
        } else {
            throw e;
        }
    }
};

module.exports = IntegerCondition;
