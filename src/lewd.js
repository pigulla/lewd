var _ = require('lodash');

var util = require('util');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    WrongParameterException = require('./exception/WrongParameterException'),
    InvalidSchemaException = require('./exception/InvalidSchemaException'),
    utils = require('./utils'),
    errorMessages = require('./messages'),
    BaseCondition = require('./condition/Base'),
    condition = {
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
        return new condition.Some(args);
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
    if (spec === Array) {
        return new condition.ArrayType();
    } else if (spec === Boolean) {
        return new condition.BooleanType();
    } else if (spec === null) {
        return new condition.NullType();
    } else if (spec === Number) {
        return new condition.NumberType();
    } else if (spec === Object) {
        return new condition.ObjectType();
    } else if (spec === String) {
        return new condition.StringType();
    } else if (spec === undefined) {
        return new condition.Any();
    } else if (utils.isLiteral(spec)) {
        return new condition.Literal(spec);
    } else if (spec instanceof RegExp) {
        return condition.Regex(spec);
    } else if (Array.isArray(spec)) {
        return condition.Array(spec);
    } else if (_.isPlainObject(spec)) {
        return condition.Object(spec);
    } else if (typeof spec === 'function') {
        return lewd.custom(spec);
    } else if (spec instanceof BaseCondition) {
        return spec;
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
    return new condition.Custom(fn);
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
    var instance = lewd._wrap(condition);
    instance.asPropertyRequired(false);
    return instance;
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
    var instance = lewd._wrap(condition);
    instance.asPropertyRequired(true);
    return instance;
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {function(*, Array.<string>)}
 */
lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return new condition.Range(options);
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {function(*, Array.<string>)}
 */
lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return new condition.Len(options);
};

/**
 * @since 0.1.0
 * @param {(string|number|boolean|null)} literal
 * @return {function(*, Array.<string>)}
 */
lewd.literal = function(literal) {
    assertParameterCount(arguments, 1);
    return new condition.Literal(literal);
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return new condition.IsoDateTime();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return new condition.Integer();
};

/**
 * @since 0.1.0
 * @param {RegExp} options
 * @return {function(*, Array.<string>)}
 */
lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return new condition.Regex(regex);
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return new condition.All(args.map(lewd._wrap));
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Array = function () {
    assertParameterCount(arguments, 0);
    return new condition.ArrayType();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return new condition.Array(args.map(lewd._wrap));
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return new condition.None(args.map(lewd._wrap));
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return new condition.ObjectType();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.String = function () {
    assertParameterCount(arguments, 0);
    return new condition.StringType();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return new condition.NumberType();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return new condition.BooleanType();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.null = function () {
    assertParameterCount(arguments, 0);
    return new condition.NullType();
};

/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return new condition.Any();
};

/**
 * @since 0.1.0
 * @param {*} value
 * @return {function(*, Array.<string>)}
 */
lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return new condition.Not(lewd._wrap(value));
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {function(*, Array.<string>)}
 */
lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return new condition.Some(args.map(lewd._wrap));
};

/**
 * @since 0.1.0
 * @param {Object} spec
 * @param {Object=} options
 * @return {function(*, Array.<string>)}
 */
lewd.object = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return new condition.Object(spec, options);
};

lewd.ConditionViolationException = ConditionViolationException;

module.exports = lewd;
