var util = require('util');

var BaseCondition = require('../Base'),
    AllCondition = require('../logic/All'),
    CustomCondition = require('../Custom'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    StringTypeCondition = require('../type/String'),
    RegexCondition = require('../content/Regex'),
    errorMessages = require('../../messages');

function isParsable(value) {
    return !isNaN(Date.parse(value));
}

// TODO: add coercion support

function IsoDateTimeCondition () {
    BaseCondition.call(this, 'IsoDateTime');
    
    this.condition = new AllCondition([
        (new CustomCondition(isParsable)).consumer(),
        (new StringTypeCondition()).consumer(),
        (new RegexCondition(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)).consumer()
    ]);
}

util.inherits(IsoDateTimeCondition, BaseCondition);

IsoDateTimeCondition.prototype.validate = function (value, path) {
    try {
        this.condition.validate(value, path);
        return value;
    } catch (e) {
        if (e instanceof ConditionViolationException) {
            this.reject(value, path, errorMessages.IsoDateTime);
        } else {
            throw e;
        }
    }
};

module.exports = IsoDateTimeCondition;
