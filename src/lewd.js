/**
 * lewd - an intuitive and easy to use data validation library
 *
 * @class lewd
 * @version 0.6.0-dev
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
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerWrapper}
 * @throws IllegalParameterException
 * @throws IllegalParameterException
 */
var lewd = function () {
    utils.assertParameterCount(arguments, 1, Infinity);

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
 * @return {lewd.condition.ConsumerWrapper}
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
            'optional', 'required', 'forbidden',
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
 * @param {(function|lewd.condition.Condition|lewd.condition.ConsumerWrapper)} fn
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.custom = function (fn) {
    utils.assertParameterCount(arguments, 1);
    
    if (utils.isConsumerWrapper(fn)) {
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
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.coerce = function (condition) {
    utils.assertParameterCount(arguments, 1);
    return lewd._wrap(condition).coerce();
};

/**
 * Marks an object property as optional.
 * 
 * @since 0.2.0
 * @param {*} condition
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.optional = function (condition) {
    utils.assertParameterCount(arguments, 1);
    return lewd._wrap(condition).optional();
};

/**
 * Marks an object property as forbidden.
 * 
 * @since 0.5.0
 * @param {*} condition
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.forbidden = function (condition) {
    utils.assertParameterCount(arguments, 1);
    return lewd._wrap(condition).forbidden();
};

/**
 * Marks an object property as required.
 * 
 * @since 0.2.0
 * @param {*} condition
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.required = function (condition) {
    utils.assertParameterCount(arguments, 1);
    return lewd._wrap(condition).required();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.integer = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.Integer()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.isoDateTime = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.IsoDateTime()).consumer();
};

/**
 * @since 0.4.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.creditcard = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.Creditcard()).consumer();
};

/**
 * @since 0.4.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.email = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.Email()).consumer();
};

/**
 * @since 0.4.0
 * @param {(string|number)=} version
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.ip = function (version) {
    utils.assertParameterCount(arguments, 0, 1);
    return (new conditions.Ip(version)).consumer();
};

/**
 * @since 0.4.0
 * @param {(string|number)=} version
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.isbn = function (version) {
    utils.assertParameterCount(arguments, 0, 1);
    return (new conditions.Isbn(version)).consumer();
};

/**
 * @since 0.4.0
 * @param {object=} options
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.url = function (options) {
    utils.assertParameterCount(arguments, 0, 1);
    return (new conditions.Url(options)).consumer();
};

/**
 * @since 0.4.0
 * @param {(string|number)=} version
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.uuid = function (version) {
    utils.assertParameterCount(arguments, 0, 1);
    return (new conditions.Uuid(version)).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.len = function (options) {
    utils.assertParameterCount(arguments, 1);
    return (new conditions.Len(options)).consumer();
};

/**
 * @since 0.1.0
 * @param {(string|number|boolean|null)} literal
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.literal = function (literal) {
    utils.assertParameterCount(arguments, 1);
    return (new conditions.Literal(literal)).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} options
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.range = function (options) {
    utils.assertParameterCount(arguments, 1);
    return (new conditions.Range(options)).consumer();
};

/**
 * @since 0.1.0
 * @param {RegExp} regex
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.regex = function (regex) {
    utils.assertParameterCount(arguments, 1);
    return (new conditions.Regex(regex)).consumer();
};

/**
 * @since 0.4.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.unique = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.Unique()).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.Array(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {Object} spec
 * @param {Object=} options
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.object = function (spec, options) {
    utils.assertParameterCount(arguments, 1, 2);
    return (new conditions.Object(spec, options)).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.Array = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.ArrayType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.Boolean = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.BooleanType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.null = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.NullType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.Number = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.NumberType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.Object = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.ObjectType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.String = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.StringType()).consumer();
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.undefined = function () {
    utils.assertParameterCount(arguments, 0);
    return (new conditions.Any()).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.All(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.None(args.map(lewd._wrap))).consumer();
};

/**
 * @since 0.1.0
 * @param {*} value
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.not = function (value) {
    utils.assertParameterCount(arguments, 1);
    return (new conditions.Not(lewd._wrap(value))).consumer();
};

/**
 * @since 0.1.0
 * @param {...*} var_args
 * @return {lewd.condition.ConsumerWrapper}
 */
lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return (new conditions.Some(args.map(lewd._wrap))).consumer();
};

lewd.ConditionViolationException = ConditionViolationException;
lewd.Condition = Condition;

module.exports = lewd;
