'use strict';

var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages'),
    IllegalParameterException = require('../../exception/IllegalParameterException');

/**
 * @class lewd.condition.content.Regex
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function RegexCondition(regex) {
    Condition.call(this, 'Regex');

    if (!(regex instanceof RegExp)) {
        throw new IllegalParameterException('Parameter must be a regular expression');
    }

    this.regex = regex;
}

util.inherits(RegexCondition, Condition);

/**
 * @inheritdoc
 */
RegexCondition.prototype.validate = function (value, path) {
    if (this.regex.test(value)) {
        return value;
    }

    this.reject(value, path, errorMessages.Regex, { regex: this.regex });
};

module.exports = RegexCondition;
