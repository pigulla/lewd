var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessage = require('../../messages').IsoDateTime;

/**
 * @class lewd.condition.composite.IsoDateTime
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function IsoDateTimeCondition() {
    var lewd = require('../../lewd');
    
    this.condition = lewd.all(
        String,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
        function (value) { return !isNaN(Date.parse(value)); }
    );

    Condition.call(this, 'IsoDateTime');
    
    this.supportsCoercion = true;
}

util.inherits(IsoDateTimeCondition, Condition);

/**
 * @inheritdoc
 */
IsoDateTimeCondition.prototype.validate = function (value, path) {
    try {
        this.condition(value, path);
    } catch (e) {
        /* istanbul ignore else */
        if (e instanceof ConditionViolationException) {
            this.reject(value, path, errorMessage);
        } else {
            throw e;
        }
    }
    
    return this._coerce ? new Date(Date.parse(value)) : value;
};

module.exports = IsoDateTimeCondition;
