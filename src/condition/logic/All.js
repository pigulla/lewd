var util = require('util');

var BaseCondition = require('../Base'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessages = require('../../messages'),
    InvalidSchemaException = require('../../exception/InvalidSchemaException');

function AllCondition(conditions) {
    BaseCondition.call(this, 'All');

    if (!Array.isArray(conditions)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }

    this.conditions = conditions;
}

util.inherits(AllCondition, BaseCondition);

AllCondition.prototype.validate = function (value, path) {
    if (this.customError) {
        try {
            this.conditions.forEach(function (condition) {
                value = condition(value, path);
            });
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                throw new ConditionViolationException(value, path, this.customError);
            } else {
                throw e;
            }
        }
    } else {
        this.conditions.forEach(function (condition) {
            value = condition(value, path);
        });
    }

    return value;
};

module.exports = AllCondition;
