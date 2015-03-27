'use strict';

var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Isin;

/**
 * @class lewd.condition.validator.Isin
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function IsinCondition() {
    Condition.call(this, 'Isin');
}

util.inherits(IsinCondition, Condition);

/**
 * @inheritdoc
 */
IsinCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isISIN(value)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = IsinCondition;
