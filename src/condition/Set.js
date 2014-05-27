var Set = require('harmony-collections').Set;

var InvalidSchemaException = require('../exception/InvalidSchemaException'),
    ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (spec) {
    var utils = require('../utils');
    
    if (!(spec instanceof Set)) {
        throw new InvalidSchemaException('Set expected');
    }
    
    spec.forEach(function (item) {
        if (!utils.isLiteral(item)) {
            throw new InvalidSchemaException('Set must only contain literal values');
        }
    });

    return utils.customMessageWrapper(function setCondition(value, path) {
        if (!spec.has(value)) {
            throw new ConditionViolationException(value, path, 'not in set of allowed values');
        }
    });
};
