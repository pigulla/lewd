var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException');

/**
 * @since 0.1.0
 * @param {*} options
 * @return {function(*, Array.<string>)}
 */
module.exports = function (options) {
    var utils = require('../utils'),
        messages = require('../messages').Len,
        opts = _.defaults({}, options, {
            min: 0,
            max: Math.POSITIVE_INFINITY,
            minInclusive: true,
            maxInclusive: true
        });

    return utils.customMessageWrapper(function lengthCondition(value, path) {
        var key;
        
        if (typeof value !== 'string' && !Array.isArray(value)) {
            throw new ConditionViolationException(value, path, messages.type, opts);
        }
        
        if (value.length > opts.max || (value.length === opts.max && !opts.maxInclusive)) {
            key = 'max' + (opts.maxInclusive ? 'Inclusive' : '');
            throw new ConditionViolationException(value, path, messages[key], opts);
        }
        if (value.length < opts.min || (value.length === opts.min && !opts.minInclusive)) {
            key = 'min' + (opts.minInclusive ? 'Inclusive' : '');
            throw new ConditionViolationException(value, path, messages[key], opts);
        }
    });
};
