var InvalidSchemaException = require('../exception/InvalidSchemaException'),
    ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (regex) {
    if (!(regex instanceof RegExp)) {
        throw new InvalidSchemaException('Regular expression expected');
    }
    
    return function regexCondition(value, path) {
        if (!regex.test(value)) {
            throw new ConditionViolationException(value, path, 'does not satisfy the regular expression');
        }
    };
};
