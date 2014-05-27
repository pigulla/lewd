var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

module.exports = function (spec) {
    var utils = require('../utils'),
        lewd = require('../lewd'),
        message = require('../messages').Array;

    if (!Array.isArray(spec)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }
    
    return utils.customMessageWrapper(function arrayCondition(values, path) {
        path = path || [];
        
        if (!Array.isArray(values)) {
            throw new ConditionViolationException(values, path, message);
        }
        
        if (spec.length === 0) {
            return;
        }

        var condition = lewd.some.apply(null, spec);

        values.forEach(function (value, index) {
            condition(value, path.concat('#' + index));
        });
    });
};
