var _ = require('lodash'),
    Set = require('harmony-collections').Set;

var ConditionViolationException = require('./exception/ConditionViolationException'),
    InvalidSchemaException = require('./exception/InvalidSchemaException'),
    anyCondition = require('./condition/Any'),
    arrayCondition = require('./condition/Array'),
    literalCondition = require('./condition/Literal'),
    objectCondition = require('./condition/Object'),
    regexCondition = require('./condition/Regex'),
    setCondition = require('./condition/Set'),
    typeCondition = require('./condition/Type');

var utils = {
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
    },

    /**
     * Wraps an arbitrary value in its appropriate condition wrapper.
     * 
     * @param {*} spec
     * @return {function}
     */
    wrap: function (spec) {
        if (utils.isJsonType(spec)) {
            return typeCondition(spec);
        }
        
        if (utils.isLiteral(spec)) {
            return literalCondition(spec);
        }
    
        if (spec instanceof RegExp) {
            return regexCondition(spec);
        }
    
        if (spec === undefined) {
            return anyCondition();
        }
    
        if (Array.isArray(spec)) {
            return arrayCondition(spec.map(utils.wrap));
        }
    
        if (spec instanceof Set) {
            return setCondition(spec);
        }
        
        if (_.isPlainObject(spec)) {
            return objectCondition(spec);
        }
    
        if (typeof spec === 'function') {
            // TODO: test if spec really is a lewd function
            return spec;
        }
    
        throw new InvalidSchemaException('Invalid specification');
    },
    
    customMessageWrapper: function (fn) {
        var message,
            wrap;
        
        wrap = function () {
            try {
                fn.apply(null, arguments);
            } catch (e) {
                if (message && e instanceof ConditionViolationException) {
                    e.message = _.template(message, {
                        originalMessage: e.message,
                        path: e.path.length === 0 ? '.' : e.path.join('.')
                    });
                }

                throw e;
            }
        };
        
        wrap.because = function (customMessage) {
            message = customMessage;
            return wrap;
        };
        
        return wrap; 
    }
};

module.exports = utils;
