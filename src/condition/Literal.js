var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

module.exports = function (literal) {
    var utils = require('../utils');
    
    if (!utils.isLiteral(literal)) {
        throw new InvalidSchemaException('Value must be a literal');
    }
    
    return function literalCondition(value, path) {
        if (value !== literal) {
            throw new ConditionViolationException(value, path, 'must be equal to literal');
        }
    };
};
