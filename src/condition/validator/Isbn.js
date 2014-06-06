var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Isbn;

/**
 * @class lewd.condition.Uuid.Isbn
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {(string|number)?} version
 */
function IsbnCondition(version) {
    if (arguments.length > 0 && (version !== undefined && ['10', '13', 10, 13].indexOf(version) === -1)) {
        throw new IllegalParameterException('Parameter must be valid ISBN version');
    }

    this.version = version;

    Condition.call(this, 'Isbn');
}

util.inherits(IsbnCondition, Condition);

/**
 * @inheritdoc
 */
IsbnCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isISBN(value + '', this.version)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = IsbnCondition;
