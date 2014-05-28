var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

/**
 * @since 0.1.0
 * @param {*} spec
 * @return {function(*, Array.<string>)}
 * @throws InvalidSchemaException
 */
module.exports = function (spec) {
    var utils = require('../utils'),
        lewd = require('../lewd'),
        message = require('../messages').Array,
        condition;

    /* istanbul ignore if */
    if (!Array.isArray(spec)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }

    // avoid the "some" condition if possible to get better error reporting 
    condition = spec.length === 1 ? lewd._wrap(spec[0]) : lewd.some.apply(null, spec);

    return utils.customMessageWrapper(function arrayCondition(values, path) {
        path = path || [];
        
        if (!Array.isArray(values)) {
            throw new ConditionViolationException(values, path, message);
        }
        
        if (spec.length > 0) {
            values.forEach(function (value, index) {
                condition(value, path.concat('#' + index));
            });
        }
    });
};
