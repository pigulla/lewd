'use strict';

var util = require('util');

var Condition = require('./Condition'),
    ConditionViolationException = require('../exception/ConditionViolationException'),
    errorMessages = require('../messages'),
    IllegalParameterException = require('../exception/IllegalParameterException');

/**
 * @class {lewd.condition.Custom}
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {function} fn
 */
function CustomCondition(fn) {
    Condition.call(this, 'Custom');

    if (typeof fn !== 'function') {
        throw new IllegalParameterException('Parameter must be a function');
    }

    this._fn = fn;
}

util.inherits(CustomCondition, Condition);

/* eslint-disable no-unused-expressions */
/**
 * @private
 * @type {function}
 */
CustomCondition.prototype._fn;
/* eslint-enable no-unused-expressions */

/**
 * @inheritdoc
 */
CustomCondition.prototype.validate = function (value, path) {
    var result;

    try {
        result = this._fn(value, path);
    } catch (e) {
        if (e instanceof ConditionViolationException) {
            this.reject(value, path, e.message);
        } else {
            throw e;
        }
    }

    if (typeof result === 'string') {
        this.reject(value, path, result);
    } else if (result === false) {
        this.reject(value, path, errorMessages.Custom);
    }

    return value;
};

module.exports = CustomCondition;
