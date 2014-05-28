var util = require('util');

var _ = require('lodash');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    InvalidSchemaException = require('./exception/InvalidSchemaException');

var utils = {
    /**
     * Formats a value in a human readable way.
     * 
     * @since 0.1.0
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
        } else if (typeof value === 'object') {
            return 'object';
        }
      
        /* istanbul ignore next */
        return '<unknown>' + value;
    },
    
    /**
     * Checks if the given value is a constructor for a native JSON type (i.e. Number, String, Boolean, Object,
     * Array or null). 
     *
     * @since 0.1.0
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
     * @since 0.1.0
     * @param {*} value
     * @return {boolean}
     */
    isLiteral: function (value) {
        return typeof value === 'string' || typeof value === 'boolean' || value === null ||
            (typeof value === 'number' && isFinite(value));
    },

    /**
     * Wraps a function so that its error message can be overridden.
     *
     * @since 0.1.0
     * @param {function(*, Array.<string>)} fn
     * @return {function(*, Array.<string>)}
     */
    customMessageWrapper: function (fn) {
        var message,
            wrap;
        
        wrap = function () {
            try {
                fn.apply(null, arguments);
            } catch (e) {
                if (message && e instanceof ConditionViolationException) {
                    var variables = _.assign(e.getTemplateVariables(), {
                        originalMessage: e.message
                    });
                    
                    e.message = _.template(message, variables);
                }

                throw e;
            }
        };
        
        wrap.because = function (customMessage) {
            message = customMessage;
            return wrap;
        };
        
        wrap._wrapped = fn.name || fn._wrapped;
        
        return wrap; 
    }
};

module.exports = utils;
