var InvalidSchemaException = require('../exception/InvalidSchemaException'),
    ConditionViolationException = require('../exception/ConditionViolationException');

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
