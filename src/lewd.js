var _ = require('lodash');

var util = require('util');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    WrongParameterException = require('./exception/WrongParameterException'),
    InvalidSchemaException = require('./exception/InvalidSchemaException'),
    utils = require('./utils'),
    errorMessages = require('./messages'),
    Condition = require('./condition/Condition'),
    conditions = {
        Custom: require('./condition/Custom'),
        
        Integer: require('./condition/composite/Integer'),
        IsoDateTime: require('./condition/composite/IsoDateTime'),

        Array: require('./condition/content/Array'),
        Len: require('./condition/content/Len'),
        Literal: require('./condition/content/Literal'),
        Object: require('./condition/content/Object'),
        Range: require('./condition/content/Range'),
        Regex: require('./condition/content/Regex'),

        All: require('./condition/logic/All'),
        Any: require('./condition/logic/Any'),
        None: require('./condition/logic/None'),
        Not: require('./condition/logic/Not'),
        Some: require('./condition/logic/Some'),

        ArrayType: require('./condition/type/Array'),
        BooleanType: require('./condition/type/Boolean'),
        NullType: require('./condition/type/Null'),
        NumberType: require('./condition/type/Number'),
        ObjectType: require('./condition/type/Object'),
        StringType: require('./condition/type/String')
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
        return (new conditions.Some(args.map(lewd._wrap))).consumer();
    }
};

/**
 * Wraps an arbitrary value in its appropriate condition wrapper (or returns the argument if it is already wrapped).
 *
 * @private
 * @param {*} spec
 * @return {function(*, Array.<string>)}
 * @throws InvalidSchemaException
 */
lewd._wrap = function (spec) {
    /*jshint maxcomplexity:false */
    if (spec === Array) {
        return (new conditions.ArrayType()).consumer();
    } else if (spec === Boolean) {
        return (new conditions.BooleanType()).consumer();
    } else if (spec === null) {
        return (new conditions.NullType()).consumer();
    } else if (spec === Number) {
        return (new conditions.NumberType()).consumer();
    } else if (spec === Object) {
        return (new conditions.ObjectType()).consumer();
    } else if (spec === String) {
        return (new conditions.StringType()).consumer();
    } else if (spec === undefined) {
        return (new conditions.Any()).consumer();
    } else if (utils.isLiteral(spec)) {
        return (new conditions.Literal(spec)).consumer();
    } else if (spec instanceof RegExp) {
        return (new conditions.Regex(spec)).consumer();
    } else if (Array.isArray(spec)) {
        return (new conditions.Array(spec.map(lewd._wrap))).consumer();
    } else if (_.isPlainObject(spec)) {
        return (new conditions.Object(spec)).consumer();
    } else if (spec instanceof Condition) {
        return spec.consumer();
    } else /* istanbul ignore else */ if (typeof spec === 'function') {
        return spec.name === 'consumerWrapper' ? spec : lewd.custom(spec);
    } else {
        throw new InvalidSchemaException('Invalid specification');
    }
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
    assertParameterCount(arguments, 1);
    return (new conditions.Custom(fn)).consumer();
};

/**
 * Marks an object property as optional.
 * 
 * @since 0.3.0
 * @param {*} condition
 * @return {function(*, Array.<string>)}
 */
lewd.coerce = function (condition) {
    assertParameterCount(arguments, 1);
    return lewd._wrap(condition).coerce();
};

/**
 * Marks an object property as optional.
 * 
 * @since 0.2.0
 * @param {*} condition
 * @return {function(*, Array.<string>)}
 */
lewd.optional = function (condition) {
    assertParameterCount(arguments, 1);
    return lewd._wrap(condition).optional();
};

/**
 * Marks an object property as required.
 * 
 * @since 0.2.0
 * @param {*} condition
 * @return {function(*, Array.<string>)}
 */
lewd.required = function (condition) {
    assertParameterCount(arguments, 1);
    return lewd._wrap(condition).required();
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {function(*, Array.<string>)}
 */
lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return (new conditions.Range(options)).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {function(*, Array.<string>)}
 */
lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return (new conditions.Len(options)).consumer();
};

/**
 * @since 0.1.0
 * @param {(string|number|boolean|null)} literal
 * @return {function(*, Array.<string>)}
 */
lewd.literal = function(literal) {
    assertParameterCount(arguments, 1);
    return (new conditions.Literal(literal)).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.IsoDateTime()).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Integer()).consumer();
};

/**
 * @since 0.1.0
 * @param {RegExp} options
 * @return {function(*, Array.<string>)}
 */
lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return (new conditions.Regex(regex)).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.All(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Array = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.ArrayType()).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.Array(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.None(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.ObjectType()).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.String = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.StringType()).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.NumberType()).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.BooleanType()).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.null = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.NullType()).consumer();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Any()).consumer();
};

/**
 * @since 0.1.0
 * @param {*} value
 * @return {function(*, Array.<string>)}
 */
lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return (new conditions.Not(lewd._wrap(value))).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.Some(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} spec
 * @param {Object=} options
 * @return {function(*, Array.<string>)}
 */
lewd.object = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return (new conditions.Object(spec, options)).consumer();
};

lewd.ConditionViolationException = ConditionViolationException;

module.exports = lewd;
