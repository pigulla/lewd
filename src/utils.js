var util = require('util');

var _ = require('lodash');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    IllegalParameterException = require('./exception/IllegalParameterException');

var utils = {
    /**
     * Checks if the given value is the consumer wrapper of a condition.
     *
     * @param {*} value
     * @return {boolean}
     */
    isConsumerWrapper: function (value) {
        // A heuristic will have to do here.
        return typeof value === 'function' && value.hasOwnProperty('isOptional') && value.hasOwnProperty('wrapped');
    },
    
    /**
     * Asserts that the given arguments array contains at least `min` and no more than `max` parameters.
     *
     * @param {Array} args The arguments array.
     * @param {number} min The number of required parameters.
     * @param {number=} max The number of allowed parameters (defaults to `min`).
     * @throws lewd.exception.IllegalParameterException
     */
    assertParameterCount: function (args, min, max) {
        max = arguments.length === 2 ? min : max;
    
        if (args.length > max) {
            throw new IllegalParameterException(util.format(
                'Function expected at most %d parameters but was called with %d',
                max, args.length
            ));
        }
        if (args.length < min) {
            throw new IllegalParameterException(util.format(
                'Function expected no more than %d parameters but was called with %d',
                min, args.length
            ));
        }
    },
    
    /**
     * Formats a value in a human readable way.
     * 
     * @param {*} value
     * @return {string}
     */
    smartFormat: function (value) {
        /*jshint maxcomplexity:false */
        if (value === null) {
            return 'null';
        } else if (value === undefined) {
            return 'undefined';
        } else if (typeof value === 'string') {
            return util.format(
                '<string:%d>"%s"',
                value.length, value.length > 10 ? (value.substr(0, 7) + '...') : value
            );
        } else if (_.isNaN(value)) {
            return 'NaN';
        } else if (_.isArguments(value)) {
            return util.format('<arguments:%d>', value.length);
        } else if (_.isDate(value)) {
            return '<date>' + value.toISOString();
        } else if (value === Infinity) {
            return 'PositiveInfinity';
        } else if (value === -Infinity) {
            return 'NegativeInfinity';
        } else if (typeof value === 'number') {
            return '<number>' + value;
        } else if (_.isRegExp(value)) {
            return '<regexp>' + value;
        } else if (typeof value === 'function') {
            return '<function>' + (value.name ? value.name : 'anonymous');
        } else if (typeof value === 'boolean') {
            return '<boolean>' + (value ? 'true' : 'false');
        } else if (Array.isArray(value)) {
            return util.format('<array:%d>', value.length);
        } else /* istanbul ignore else */ if (typeof value === 'object') {
            return 'object';
        } else {
            return '<unknown>' + value;
        }
    },
    
    /**
     * Checks if the given value is a constructor for a native JSON type (i.e. Number, String, Boolean, Object,
     * Array or null). 
     *
     * @param {*} value
     * @return {boolean}
     */
    isJsonType: function  (value) {
        return value === Array || value === Number || value === String || value === Boolean || value === Object ||
            value === null;
    },

    /**
     * Checks if the given value is a valid literal for a JSON value, excluding arrays and objects (i.e. a string,
     * number, boolean or null).
     *
     * @param {*} value
     * @return {boolean}
     */
    isLiteral: function (value) {
        return typeof value === 'string' || typeof value === 'boolean' || value === null ||
            (typeof value === 'number' && isFinite(value));
    }
};

module.exports = utils;
