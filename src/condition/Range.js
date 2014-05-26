var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (options) {
    var opts = _.defaults({}, options, {
        min: -Infinity,
        max: Infinity,
        minInclusive: true,
        maxInclusive: true
    });

    return function rangeCondition(value, path) {
        if (value > opts.max || (value === opts.max && !opts.maxInclusive)) {
            throw new ConditionViolationException(value, path, 'greater than ' + opts.max);
        }
        if (value < opts.min || (value === opts.min && !opts.minInclusive)) {
            throw new ConditionViolationException(value, path, 'greater than ' + opts.min);
        }
    };
};
