'use strict';

var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Json,
    utils = require('../../utils');

/**
 * @class lewd.condition.type.Json
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function JsonTypeCondition() {
    Condition.call(this, 'JsonType');
}

util.inherits(JsonTypeCondition, Condition);

/**
 * @private
 * @param {*} value
 * @param {Array.<(string|number)>} path
 */
JsonTypeCondition.prototype._validate = function (value, path) {
    if (utils.isLiteral(value)) {
        return;
    } else if (Array.isArray(value)) {
        value.forEach(function (element, index) {
            this._validate(element, path.concat(index));
        }, this);
    } else if (_.isPlainObject(value)) {
        utils.getEnumerableProperties(value).forEach(function (key) {
            this._validate(value[key], path.concat(key));
        }, this);
    } else {
        this.reject(value, path, errorMessage, { type: 'invalid' });
    }
};

/**
 * @inheritdoc
 */
JsonTypeCondition.prototype.validate = function (value, path) {
    this._validate(value, path);
    return value;
};

module.exports = JsonTypeCondition;
