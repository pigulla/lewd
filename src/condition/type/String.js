var util = require('util');

var CoercableCondition = require('../CoercableCondition'),
    errorMessage = require('../../messages').Type;

/**
 * @class lewd.condition.type.String
 * @extends {lewd.condition.CoercableCondition}
 * @constructor
 */
function StringTypeCondition () {
    CoercableCondition.call(this, 'StringType');
}

util.inherits(StringTypeCondition, CoercableCondition);

/**
 * @inheritdoc
 */
StringTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'string') {
        return value;
    }
    
    if (this.coerce) {
        return value + '';
    }

    this.reject(value, path, errorMessage, { type: 'string' });
};

module.exports = StringTypeCondition;
