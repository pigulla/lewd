var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Url;

/**
 * @class lewd.condition.validator.Url
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {object=} options
 */
function UrlCondition(options) {
    if (options && typeof options !== 'object') {
        throw new IllegalParameterException('Parameter must be an object');
    }
    
    this.options = options || {};

    Condition.call(this, 'Url');
}

util.inherits(UrlCondition, Condition);

/**
 * @inheritdoc
 */
UrlCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isURL(value, this.options)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = UrlCondition;
