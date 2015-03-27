'use strict';

var util = require('util');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Integer;

/**
 * @class lewd.condition.composite.Integer
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function IntegerCondition() {
    Condition.call(this, 'Integer');

    this.supportsCoercion = true;
}

util.inherits(IntegerCondition, Condition);

/**
 * @inheritdoc
 */
IntegerCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'number' || !isFinite(value)) {
        this.reject(value, path, errorMessage);
    }

    if (this._coerce) {
        return Math.round(value);
    }

    if (value === Math.round(value)) {
        return value;
    }

    this.reject(value, path, errorMessage);
};

module.exports = IntegerCondition;
