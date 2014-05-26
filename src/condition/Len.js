var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (options) {
    var opts = _.defaults({}, options, {
        min: 0,
        max: Math.POSITIVE_INFINITY,
        minInclusive: true,
        maxInclusive: true
    });

    return function lengthCondition(value, path) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
            throw new ConditionViolationException(value, path, 'has no length to check');
        }
        
        if (value.length > opts.max || (value.length === opts.max && !opts.maxInclusive)) {
            throw new ConditionViolationException(value, path, 'longer than ' + opts.max);
        }
        if (value.length < opts.min || (value.length === opts.min && !opts.minInclusive)) {
            throw new ConditionViolationException(value, path, 'shorter than ' + opts.min);
        }
    };
};
