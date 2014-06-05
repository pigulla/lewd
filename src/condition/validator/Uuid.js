var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Uuid;

/**
 * @class lewd.condition.validator.Uuid
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function UuidCondition(version) {
    if (arguments.length > 0 && ['all', '1', '2', '3', 1, 2, 3].indexOf(version) === -1) {
        throw new IllegalParameterException('Parameter must be valid UUID version');
    }
    
    this.version = arguments.length === 0 ? 'all' : arguments[0];

    Condition.call(this, 'Uuid');
}

util.inherits(UuidCondition, Condition);

/**
 * @inheritdoc
 */
UuidCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }
    
    if (!validator.isUUID(value, this.version)) {
        this.reject(value, path, errorMessages.invalid);
    }
    
    return value;
};

module.exports = UuidCondition;
