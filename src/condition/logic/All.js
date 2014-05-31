var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

function AllCondition(conditions) {
    BaseCondition.call(this, 'All');
    this.conditions = conditions;
}

util.inherits(AllCondition, BaseCondition);

AllCondition.prototype.validate = function (value, path) {
    this.conditions.forEach(function (condition) {
        value = condition.validate(value, path);
    });

    return value;
};

module.exports = AllCondition;
