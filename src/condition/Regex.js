var InvalidSchemaException = require('../exception/InvalidSchemaException'),
    ConditionViolationException = require('../exception/ConditionViolationException');

/**
 * @since 0.1.0
 * @param {RegExp} object
 * @return {function(*, Array.<string>)}
 * @throws InvalidSchemaException
 */
module.exports = function (regex) {
    var utils = require('../utils'),
        message = require('../messages').Regex;
    
    if (!(regex instanceof RegExp)) {
        throw new InvalidSchemaException('Regular expression expected');
    }
    
    return utils.customMessageWrapper(function regexCondition(value, path) {
        if (!regex.test(value)) {
            throw new ConditionViolationException(value, path, message);
        }
    });
};
