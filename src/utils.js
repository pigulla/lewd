'use strict';

var util = require('util');

var _ = require('lodash');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    IllegalParameterException = require('./exception/IllegalParameterException');

var utils = {
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
            return 'Infinity';
        } else if (value === -Infinity) {
            return '-Infinity';
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
            // Could be a host object.
            return '<unknown>' + value;
        }
    },

    /**
     * Checks if the given value is a "basic object", i.e. an object that is not actually one of JavaScript's built-in
     * object-like types.
     *
     * This function does not detect "subclasses" of built-in types, e.g. `Object.create(Date)`.
     *
     * @param {*} value
     * @return {boolean}
     */
    isBasicObject: function (value) {
        return (!!value && typeof value === 'object' &&
            !(Array.isArray(value) || value instanceof RegExp || value instanceof Date));
    },

    /**
     * Returns all enumerable keys of the given object.
     *
     * @param {Object} value
     * @return {Array.<string>}
     */
    getEnumerableProperties: function (value) {
        var keys = [],
            k;

        /* eslint-disable guard-for-in */
        for (k in value) {
            keys.push(k);
        }
        /* eslint-enable guard-for-in */

        return keys;
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
