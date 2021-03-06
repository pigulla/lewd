'use strict';

var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Type,
    utils = require('../../utils');

/**
 * @class lewd.condition.type.Object
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function ObjectTypeCondition() {
    Condition.call(this, 'ObjectType');
}

util.inherits(ObjectTypeCondition, Condition);

/**
 * @inheritdoc
 */
ObjectTypeCondition.prototype.validate = function (value, path) {
    if (utils.isBasicObject(value)) {
        return value;
    }

    this.reject(value, path, errorMessage, { type: 'object' });
};

module.exports = ObjectTypeCondition;
