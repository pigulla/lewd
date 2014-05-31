var util = require('util');

var BaseCondition = require('../Base'),
    AllCondition = require('../logic/All'),
    StringTypeCondition = require('../type/String'),
    RegexCondition = require('../content/Regex'),
    errorMessages = require('../../messages');

function isParsable(value) {
    return !isNaN(Date.parse(value));
}

function IsoDateTimeCondition () {
    BaseCondition.call(this, 'IsoDateTime');
    this.condition = new AllCondition([
        // TODO: add parsable condition
        new StringTypeCondition(),
        new RegexCondition(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    ]);
    this.condition.because(errorMessages.IsoDateTime);
}

util.inherits(IsoDateTimeCondition, BaseCondition);

IsoDateTimeCondition.prototype.validate = function (value, path) {
    return this.condition.validate(value, path);
};

module.exports = IsoDateTimeCondition;
