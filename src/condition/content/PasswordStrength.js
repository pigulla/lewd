var util = require('util');

var StrengthTest = require('owasp-password-strength-test');

var Condition = require('../Condition'),
    errorMessages = require('../../messages').PasswordStrength,
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    utils = require('../../utils');

/**
 * @class lewd.condition.content.PasswordStrength
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function PasswordStrength () {
    Condition.call(this, 'PasswordStrength');
}

util.inherits(PasswordStrength, Condition);

/**
 * @inheritdoc
 */
PasswordStrength.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }
    
    var result = StrengthTest.test(value);
    
    if (result.strong) {
        return value;
    }
    
    this.reject(value, path, errorMessages.test[result.failedTests[0]]);
};

module.exports = PasswordStrength;
