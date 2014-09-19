var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Fqdn;

/**
 * @class lewd.condition.validator.Fqdn
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {object=} options
 */
function FqdnCondition(options) {
    if (options && typeof options !== 'object') {
        throw new IllegalParameterException('Parameter must be an object');
    }

    this.options = options || {};

    Condition.call(this, 'Fqdn');
}

util.inherits(FqdnCondition, Condition);

/**
 * @inheritdoc
 */
FqdnCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isFQDN(value, this.options)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = FqdnCondition;
