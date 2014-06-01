var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

function ObjectTypeCondition () {
    Condition.call(this, 'ObjectType');
}

util.inherits(ObjectTypeCondition, Condition);

ObjectTypeCondition.prototype.validate = function (value, path) {
    if (_.isPlainObject(value)) {
        return value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'object' });
};

module.exports = ObjectTypeCondition;
