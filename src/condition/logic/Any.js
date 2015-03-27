'use strict';

var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.logic.Any
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function AnyCondition() {
    Condition.call(this, 'Any');
}

util.inherits(AnyCondition, Condition);

/**
 * @inheritdoc
 */
AnyCondition.prototype.validate = function (value, path) {
    return value;
};

module.exports = AnyCondition;
