var util = require('util');

var _ = require('lodash');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

function ObjectTypeCondition () {
    BaseCondition.call(this, 'ObjectType');
}

util.inherits(ObjectTypeCondition, BaseCondition);

ObjectTypeCondition.prototype.validate = function (value, path) {
    if (_.isPlainObject(value)) {
        return value;
    }

    this.reject(value, path, errorMessages.Type, { type: 'object' });
};

module.exports = ObjectTypeCondition;
