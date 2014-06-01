var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessage = require('../../messages').IsoDateTime;

function isParsable(value) {
    return !isNaN(Date.parse(value));
}

function IsoDateTimeCondition () {
    var lewd = require('../../lewd');

    Condition.call(this, 'IsoDateTime');
    
    this.supportsCoercion = true;
    this.condition = new lewd.all(
        lewd(String),
        lewd(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
        lewd(isParsable)
    );
}

util.inherits(IsoDateTimeCondition, Condition);

IsoDateTimeCondition.prototype.validate = function (value, path) {
    try {
        this.condition(value, path);
        return this.coerce ? new Date(Date.parse(value)) : value;
    } catch (e) {
        /* istanbul ignore else */
        if (e instanceof ConditionViolationException) {
            this.reject(value, path, errorMessage);
        } else {
            throw e;
        }
    }
};

module.exports = IsoDateTimeCondition;
