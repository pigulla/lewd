var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages'),
    InvalidSchemaException = require('../../exception/InvalidSchemaException');

function RegexCondition (regex) {
    BaseCondition.call(this, 'Regex');

    if (!(regex instanceof RegExp)) {
        throw new InvalidSchemaException('Parameter must be a regular expression');
    }

    this.regex = regex;
}

util.inherits(RegexCondition, BaseCondition);

RegexCondition.prototype.validate = function (value, path) {
    if (this.regex.test(value)) {
        return value;
    }

    this.reject(value, path, errorMessages.Regex, { regex: this.regex });
};

module.exports = RegexCondition;
