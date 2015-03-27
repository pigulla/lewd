'use strict';

var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

/**
 * @class lewd.condition.logic.Ignore
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function IgnoreCondition() {
    Condition.call(this, 'Ignore');
}

util.inherits(IgnoreCondition, Condition);

/**
 * @inheritdoc
 */
IgnoreCondition.prototype.validate = function (value, path) {
    return value;
};

module.exports = IgnoreCondition;
