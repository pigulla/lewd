var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

function validateOptions(options) {
    if (typeof options !== 'object') {
        throw new InvalidSchemaException('Options must be an object');
    }
    
    var defaults = {
            min: -Infinity,
            max: Infinity,
            minInclusive: true,
            maxInclusive: true
        },
        opts = _.defaults({}, options, defaults),
        unknownOptions = _.difference(Object.keys(options), Object.keys(defaults));
    
    if (unknownOptions.length > 0) {
        throw new InvalidSchemaException('Unknown option: "' + unknownOptions[0] + '"');
    }
    
    if (typeof opts.min !== 'number') {
        throw new InvalidSchemaException('Option "min" must be a number');
    }
    if (typeof opts.max !== 'number') {
        throw new InvalidSchemaException('Option "max" must be a number');
    }
    if (typeof opts.minInclusive !== 'boolean') {
        throw new InvalidSchemaException('Option "minInclusive" must be a boolean');
    }
    if (typeof opts.maxInclusive !== 'boolean') {
        throw new InvalidSchemaException('Option "maxInclusive" must be a boolean');
    }

    return opts;
}

/**
 * @since 0.1.0
 * @param {Objects} option
 * @return {function(*, Array.<string>)}
 */
module.exports = function (options) {
    var utils = require('../utils'),
        messages = require('../messages').Range,
        opts = validateOptions(options);

    return utils.customMessageWrapper(function rangeCondition(value, path) {
        var key;
        
        if (value > opts.max || (value === opts.max && !opts.maxInclusive)) {
            key = 'max' + (opts.maxInclusive ? 'Inclusive' : '');
            throw new ConditionViolationException(value, path, messages[key], opts);
        }
        if (value < opts.min || (value === opts.min && !opts.minInclusive)) {
            key = 'min' + (opts.minInclusive ? 'Inclusive' : '');
            throw new ConditionViolationException(value, path, messages[key], opts);
        }
    });
};
