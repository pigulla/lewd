var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException');

/**
 * @since 0.1.0
 * @param {Objects} option
 * @return {function(*, Array.<string>)}
 */
module.exports = function (options) {
    var utils = require('../utils'),
        messages = require('../messages').Range,
        opts = _.defaults({}, options, {
            min: -Infinity,
            max: Infinity,
            minInclusive: true,
            maxInclusive: true
        });

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
