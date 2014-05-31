var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages'),
    InvalidSchemaException = require('../lexception/InvalidSchemaException');

function ArrayCondition (spec) {
    var AllCondition = require('../logic/All'),
        AnyCondition = require('../logic/Any');
    
    BaseCondition.call(this, 'Array');

    if (!Array.isArray(spec)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }

    // avoid the "some" condition if possible to get better error reporting
    if (spec.length === 0) {
        this.condition = new AnyCondition();
    } else if (spec.length === 1) {
        this.condition = spec[0];
    } else {
        this.condition = new AllCondition(spec);
    }
}

util.inherits(ArrayCondition, BaseCondition);

ArrayCondition.prototype.validate = function (value, path) {
    if (!Array.isArray(value)) {
        this.reject(value, path, errorMessages.Array);
    }

    value.forEach(function (item, index) {
        this.condition.validate(item, path.concat('#' + index));
    }, this);

    return value;
};

module.exports = ArrayCondition;
