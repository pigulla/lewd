var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException');

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
        if (typeof value !== 'string' && !Array.isArray(value)) {
            throw new ConditionViolationException(value, path, messages.type, opts);
        }
        
        if (value.length > opts.max || (value.length === opts.max && !opts.maxInclusive)) {
            throw new ConditionViolationException(value, path, messages.max, opts);
        }
        if (value.length < opts.min || (value.length === opts.min && !opts.minInclusive)) {
            throw new ConditionViolationException(value, path, messages.min, opts);
        }
    });
};
