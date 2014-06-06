var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Creditcard;

/**
 * @class lewd.condition.validator.Creditcard
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function CreditcardCondition() {
    Condition.call(this, 'Creditcard');
}

util.inherits(CreditcardCondition, Condition);

/**
 * @inheritdoc
 */
CreditcardCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isCreditCard(value)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = CreditcardCondition;
