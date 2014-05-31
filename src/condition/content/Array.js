var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    InvalidSchemaException = require('../../exception/InvalidSchemaException');

function ArrayCondition (conditions) {
    var AllCondition = require('../logic/All'),
        AnyCondition = require('../logic/Any');
    
    BaseCondition.call(this, 'Array');

    if (!Array.isArray(conditions)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }

    // avoid the "some" condition if possible to get better error reporting
    if (conditions.length === 0) {
        this.condition = (new AnyCondition()).consumer();
    } else if (conditions.length === 1) {
        this.condition = conditions[0];
    } else {
        this.condition = (new AllCondition(conditions)).consumer();
    }
}

util.inherits(ArrayCondition, BaseCondition);

ArrayCondition.prototype.validate = function (value, path) {
    if (!Array.isArray(value)) {
        this.reject(value, path, errorMessages.Array);
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
