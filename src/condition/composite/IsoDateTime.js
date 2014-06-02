var util = require('util');

var CoercableCondition = require('../CoercableCondition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    errorMessage = require('../../messages').IsoDateTime;

/**
 * @class lewd.condition.composite.IsoDateTime
 * @extends {lewd.condition.CoercableCondition}
 * @constructor
 */
function IsoDateTimeCondition() {
    var lewd = require('../../lewd'),
        condition = lewd.all(
            lewd(String),
            lewd(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
            lewd(function (value) { return !isNaN(Date.parse(value)); })
        );

    CoercableCondition.call(this, 'IsoDateTime', condition);
}

util.inherits(IsoDateTimeCondition, CoercableCondition);

/**
 * @inheritdoc
 */
IsoDateTimeCondition.prototype._coerce = function (value) {
    return new Date(Date.parse(value));
};

/**
 * @inheritdoc
 */
IsoDateTimeCondition.prototype.validate = function (value, path) {
    return CoercableCondition.prototype.validate.call(this, value, path, errorMessage);
};

module.exports = IsoDateTimeCondition;
