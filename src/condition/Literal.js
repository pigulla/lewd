var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

/**
 * @since 0.1.0
 * @param {string|number|boolean|null} literal
 * @return {function(*, Array.<string>)}
 * @throws InvalidSchemaException
 */
module.exports = function (literal) {
    var utils = require('../utils'),
        message = require('../messages').Literal;
    
    if (!utils.isLiteral(literal)) {
        throw new InvalidSchemaException('Value must be a literal');
    }
    
    return utils.customMessageWrapper(function literalCondition(value, path) {
        if (value !== literal) {
            throw new ConditionViolationException(value, path, message, {
                literal: literal,
                literalStr: utils.smartFormat(literal)
            });
        }

        return value;
    });
};
