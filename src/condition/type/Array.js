'use strict';

var util = require('util');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Type;

/**
 * @class lewd.condition.type.Array
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function ArrayTypeCondition() {
    Condition.call(this, 'ArrayType');
}

util.inherits(ArrayTypeCondition, Condition);

/**
 * @inheritdoc
 */
ArrayTypeCondition.prototype.validate = function (value, path) {
    if (Array.isArray(value)) {
        return value;
    }

    this.reject(value, path, errorMessage, { type: 'array' });
};

module.exports = ArrayTypeCondition;
