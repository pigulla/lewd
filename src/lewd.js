/**
 * lewd - an intuitive and easy to use data validation library
 *
 * @class lewd
 * @version 0.5.0-dev
 * @author Raphael Pigulla <pigulla@four66.com>
 * @license BSD-2-Clause
 */
    
var _ = require('lodash');

var util = require('util');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    IllegalParameterException = require('./exception/IllegalParameterException'),
    utils = require('./utils'),
    errorMessages = require('./messages'),
    Condition = require('./condition/Condition'),
    conditions = {
        Custom: require('./condition/Custom'),
        
        Integer: require('./condition/composite/Integer'),
        IsoDateTime: require('./condition/composite/IsoDateTime'),

        Creditcard: require('./condition/validator/Creditcard'),
        Email: require('./condition/validator/Email'),
        Ip: require('./condition/validator/Ip'),
        Isbn: require('./condition/validator/Isbn'),
        Url: require('./condition/validator/Url'),
        Uuid: require('./condition/validator/Uuid'),

        Array: require('./condition/structure/Array'),
        Object: require('./condition/structure/Object'),
        Unique: require('./condition/structure/Unique'),

        Len: require('./condition/content/Len'),
        Literal: require('./condition/content/Literal'),
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
 * Asserts that the given arguments array contains at least `min` and no more than `max` parameters.
 * 
 * @param {Array} args The arguments array.
 * @param {number} min The number of required parameters.
 * @param {number=} max The number of allowed parameters (defaults to `min`).
 * @throws lewd.exception.IllegalParameterException
 */
function assertParameterCount(args, min, max) {
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
}

/**
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerCondition}
 * @throws IllegalParameterException
 * @throws IllegalParameterException
 */
var lewd = function () {
    assertParameterCount(arguments, 1, Infinity);

    if (arguments.length === 1) {
        return lewd._wrap(arguments[0]);
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
 * @return {lewd.condition.ConsumerCondition}
 * @throws IllegalParameterException
 */
lewd._wrap = function (spec) {
    var shorthands = [
        lewd.Array, lewd.Boolean, lewd.null, lewd.Number, lewd.Object, lewd.String, lewd.undefined,
        lewd.unique, lewd.isoDateTime, lewd.integer, lewd.ip, lewd.email, lewd.uuid, lewd.url, lewd.isbn,
        lewd.creditcard
    ];
    
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
    } else if (shorthands.indexOf(spec) !== -1) {
        return spec();
    } else if (typeof spec === 'function') {
        return utils.isConsumerWrapper(spec) ? spec : lewd.custom(spec);
    } else {
        throw new IllegalParameterException('Invalid specification');
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
            'creditcard', 'email', 'ip', 'isbn', 'url', 'uuid',
            'integer', 'isoDateTime',
            'array', 'len', 'literal', 'object', 'range', 'regex',
            'all', 'any', 'none', 'not', 'some'
        ],
        additionalFunctions = ['Array', 'Boolean', 'null', 'Number', 'Object', 'String', 'undefined'];
    
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
 * @param {(function|lewd.condition.Condition|lewd.condition.ConsumerCondition)} fn
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.custom = function (fn) {
    assertParameterCount(arguments, 1);
    
    if (typeof fn === 'function' && fn.name === 'consumerWrapper') {
        return fn;
    } else if (fn instanceof Condition) {
        return fn.consumer();
    } else if (typeof fn === 'function') {
        return (new conditions.Custom(fn)).consumer();
    } else {
        throw new IllegalParameterException('Invalid specification');
    }
};

/**
 * Marks an object property as optional.
 * 
 * @since 0.3.0
 * @param {*} condition
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.coerce = function (condition) {
    assertParameterCount(arguments, 1);
    return lewd._wrap(condition).coerce();
};

/**
 * Allows coercion for an object property (if the corresponding condition supports it).
 * 
 * @since 0.2.0
 * @param {*} condition
 * @return {lewd.condition.ConsumerCondition}
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
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.required = function (condition) {
    assertParameterCount(arguments, 1);
    return lewd._wrap(condition).required();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Integer()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.IsoDateTime()).consumer();
};

/**
 * @since 0.4.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.creditcard = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Creditcard()).consumer();
};

/**
 * @since 0.4.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.email = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Email()).consumer();
};

/**
 * @since 0.4.0
 * @param {(string|number)=} version
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.ip = function (version) {
    assertParameterCount(arguments, 0, 1);
    return (new conditions.Ip(version)).consumer();
};

/**
 * @since 0.4.0
 * @param {(string|number)=} version
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.isbn = function (version) {
    assertParameterCount(arguments, 0, 1);
    return (new conditions.Isbn(version)).consumer();
};

/**
 * @since 0.4.0
 * @param {object=} options
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.url = function (options) {
    assertParameterCount(arguments, 0, 1);
    return (new conditions.Url(options)).consumer();
};

/**
 * @since 0.4.0
 * @param {(string|number)=} version
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.uuid = function (version) {
    assertParameterCount(arguments, 0, 1);
    return (new conditions.Uuid(version)).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return (new conditions.Len(options)).consumer();
};

/**
 * @since 0.1.0
 * @param {(string|number|boolean|null)} literal
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.literal = function(literal) {
    assertParameterCount(arguments, 1);
    return (new conditions.Literal(literal)).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return (new conditions.Range(options)).consumer();
};

/**
 * @since 0.1.0
 * @param {RegExp} regex
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return (new conditions.Regex(regex)).consumer();
};

/**
 * @since 0.4.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.unique = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Unique()).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.Array(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} spec
 * @param {Object=} options
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.object = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return (new conditions.Object(spec, options)).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.Array = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.ArrayType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.BooleanType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.null = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.NullType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.NumberType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.ObjectType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.String = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.StringType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return (new conditions.Any()).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.All(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.None(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {*} value
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return (new conditions.Not(lewd._wrap(value))).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerCondition}
 */
lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.Some(args.map(lewd._wrap))).consumer();
};

lewd.ConditionViolationException = ConditionViolationException;
lewd.Condition = Condition;

module.exports = lewd;
