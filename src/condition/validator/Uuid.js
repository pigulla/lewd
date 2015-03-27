'use strict';

var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Uuid;

/**
 * @class lewd.condition.validator.Uuid
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {(string|number)?} version
 */
function UuidCondition(version) {
    if (arguments.length > 0 && (version !== undefined && ['all', '3', '4', '5', 3, 4, 5].indexOf(version) === -1)) {
        throw new IllegalParameterException('Parameter must be valid UUID version');
    }

    this.version = !version ? 'all' : version + '';

    Condition.call(this, 'Uuid');
}

util.inherits(UuidCondition, Condition);

/**
 * @inheritdoc
 */
UuidCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isUUID(value, this.version)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = UuidCondition;
