var util = require('util');

var BaseCondition = require('../Base'),
    AllCondition = require('../logic/All'),
    NumberTypeCondition = require('../type/Number'),
    RegexCondition = require('../content/Regex'),
    errorMessages = require('../../messages');

function IntegerCondition () {
    BaseCondition.call(this, 'Integer');
    this.condition = new AllCondition([
        new NumberTypeCondition(),
        new RegexCondition(/^-?\d+$/)
    ]);
}

util.inherits(IntegerCondition, BaseCondition);

IntegerCondition.prototype.validate = function (value, path) {
    return this.condition.validate(value, path);
};

module.exports = IntegerCondition;
