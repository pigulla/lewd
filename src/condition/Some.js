var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

module.exports = function (spec) {
    var lewd = require('../lewd'),
        utils = require('../utils'),
        message = require('../messages').Some;

    /* istanbul ignore if */
    if (!Array.isArray(spec)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }

    return utils.customMessageWrapper(function someCondition(value, path) {
        var conditions = spec.map(lewd._wrap);

        if (conditions.length === 0) {
            return;
        }
        
        var satisfied = false,
            violatedConditions = conditions.map(function (condition) {
                try {
                    condition(value, path);
                    satisfied = true;
                } catch (e) {
                    if (e instanceof ConditionViolationException) {
                        return e;
                    } else {
                        throw e;
                    }
                }
            }).filter(function (item) {
                return !!item;
            });
        
        if (!satisfied) {
            throw new ConditionViolationException(
                value, violatedConditions[0].path,
                message
            );
        }
    });
};
