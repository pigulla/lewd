var _ = require('lodash');

var util = require('util');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    WrongParameterException = require('./exception/WrongParameterException'),
    InvalidSchemaException = require('./exception/InvalidSchemaException'),
    utils = require('./utils'),
    errorMessages = require('./messages'),
    condition = {
        all: require('./condition/All'),
        any: require('./condition/Any'),
        array: require('./condition/Array'),
        integer: require('./condition/composite/Integer'),
        isoDateTime: require('./condition/composite/IsoDateTime'),
        len: require('./condition/Len'),
        literal: require('./condition/Literal'),
        none: require('./condition/None'),
        not: require('./condition/Not'),
        object: require('./condition/Object'),
        range: require('./condition/Range'),
        regex: require('./condition/Regex'),
        some: require('./condition/Some'),
        type: require('./condition/Type')
    };

/**
 * @param {Array} args
 * @param {number} min
 * @param {number=} max
 */
function assertParameterCount(args, min, max) {
    max = arguments.length === 2 ? min : max;

    if (args.length > max) {
        throw new WrongParameterException(util.format(
            'Function expected at most %d parameters but was called with %d',
            max, args.length
        ));
    }
    if (args.length < min) {
        throw new WrongParameterException(util.format(
            'Function expected no more than %d parameters but was called with %d',
            min, args.length
        ));
    }
}

/**
 * @version 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 * @throws WrongParameterException
 * @throws InvalidSchemaException
 */
var lewd = function () {
    if (arguments.length === 1) {
        return lewd._wrap(arguments[0]);
    } else if (arguments.length === 0) {
        throw new WrongParameterException('at least one parameter must be given');
    } else {
        var args = Array.prototype.slice.call(arguments);
        return condition.some(args);
    }
};

/**
 * Wraps an arbitrary value in its appropriate condition wrapper.
 *
 * @private
 * @param {*} spec
 * @return {function(*, Array.<string>)}
 * @throws InvalidSchemaException
 */
lewd._wrap = function (spec) {
    if (utils.isJsonType(spec) || spec === undefined) {
        return condition.type(spec);
    }

    if (utils.isLiteral(spec)) {
        return condition.literal(spec);
    }
    
    if (spec instanceof RegExp) {
        return condition.regex(spec);
    }

    if (Array.isArray(spec)) {
        return condition.array(spec);
    }

    if (_.isPlainObject(spec)) {
        return condition.object(spec);
    }

    if (typeof spec === 'function') {
        if (spec.hasOwnProperty('_wrapped')) {
            return spec;
        } else {
            return lewd.custom(spec);
        }
    }

    /* istanbul ignore next */
    throw new InvalidSchemaException('Invalid specification');
};

/* istanbul ignore next */
/**
 * Exposes the condition functions into the global namespace. Throws an error if a collision occurs.
 * 
 * @experimental 0.1.0
 * @param {string=} prefix
 * @throws Error
 */
lewd.expose = function (prefix) {
    var p = prefix || '',
        exposedFunctions = [
            'range', 'len', 'literal', 'isoDateTime', 'integer', 'regex', 'all', 'array', 'none', 'not',
            'some', 'object'
        ],
        additionalFunctions = ['Boolean', 'Number', 'Object', 'null', 'undefined', 'String', 'Array'];
    
    var expose = function (name) {
        var exposedName = p + name;

        if (this[exposedName] !== undefined) {
            throw new Error(util.format(
                'Cannot expose function "%s" because "%s" is already defined in the global scope',
                name, exposedName
            ));
        }
        this[exposedName] = lewd[name];
    }.bind(this);
    
    exposedFunctions.forEach(expose);

    if (p.length > 0) {
        additionalFunctions.forEach(expose);
    }
};

/**
 * @since 0.2.0
 * @param {function(*)} fn
 * @return {function(*, Array.<string>)}
 */
lewd.custom = function (fn) {
    return utils.customMessageWrapper(function customCondition(value, path) {
        var result = fn.call(null, value, path || []);

        if (typeof result === 'string') {
            throw new ConditionViolationException(value, path, result);
        } else if (result === false) {
            throw new ConditionViolationException(value, path, errorMessages.Custom);
        }
    });
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {function(*, Array.<string>)}
 */
lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return condition.range(options);
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {function(*, Array.<string>)}
 */
lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return condition.len(options);
};

/**
 * @since 0.1.0
 * @param {(string|number|boolean|null)} literal
 * @return {function(*, Array.<string>)}
 */
lewd.literal = function(literal) {
    assertParameterCount(arguments, 1);
    return condition.literal(literal);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return condition.isoDateTime();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return condition.integer();
};

/**
 * @since 0.1.0
 * @param {RegExp} options
 * @return {function(*, Array.<string>)}
 */
lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return condition.regex(regex);
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.all(args);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Array = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Array);
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.array(args);
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.none(args);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Object);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.String = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(String);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Number);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Boolean);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.null = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(null);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(undefined);
};

/**
 * @since 0.1.0
 * @param {*} value
 * @return {function(*, Array.<string>)}
 */
lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return condition.not(value);
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.some(args);
};

/**
 * @since 0.1.0
 * @param {Object} spec
 * @param {Object=} options
 * @return {function(*, Array.<string>)}
 */
lewd.object = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return condition.object(spec, options);
};

lewd.ConditionViolationException = ConditionViolationException;

module.exports = lewd;
