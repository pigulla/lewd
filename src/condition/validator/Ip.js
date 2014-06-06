var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Ip;

/**
 * @class lewd.condition.validator.Ip
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {(string|number)?} version
 */
function IpCondition(version) {
    if (arguments.length > 0 && (version !== undefined && ['4', '6', 4, 6].indexOf(version) === -1)) {
        throw new IllegalParameterException('Parameter must be valid IP version');
    }

    this.version = version;

    Condition.call(this, 'Ip');
}

util.inherits(IpCondition, Condition);

/**
 * @inheritdoc
 */
IpCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isIP(value, this.version)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = IpCondition;
