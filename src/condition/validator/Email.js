var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Email;

/**
 * @class lewd.condition.validator.Email
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function EmailCondition() {
    Condition.call(this, 'Email');
}

util.inherits(EmailCondition, Condition);

/**
 * @inheritdoc
 */
EmailCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isEmail(value)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = EmailCondition;
