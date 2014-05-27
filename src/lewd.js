var util = require('util');

var Set = require('harmony-collections').Set;

var ConditionViolationException = require('./exception/ConditionViolationException'),
    UnexpectedParameterException = require('./exception/UnexpectedParameterException'),
    InvalidSchemaException = require('./exception/InvalidSchemaException'),
    utils = require('./utils'),
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
        set: require('./condition/Set'),
        some: require('./condition/Some')
    };

function assertParameterCount(args, min, max) {
    max = arguments.length === 2 ? min : max;
    
    if (args.length > max) {
        throw new UnexpectedParameterException(util.format(
            'Function expected at most %d parameters but was called with %d',
            max, args.length
        ));
    }
    if (args.length < min) {
        throw new UnexpectedParameterException(util.format(
            'Function expected no more than %d parameters but was called with %d',
            min, args.length
        ));
    }
}

var Lewd = function () {
    if (arguments.length === 1) {
        return utils.wrap(arguments[0]);
    } else if (arguments.length === 0) {
        throw new InvalidSchemaException('at least one parameter must be given');
    } else {
        var args = Array.prototype.slice.call(arguments);
        return condition.some(args);
    }
};

Lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return condition.range(options);
};

Lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return condition.len(options);
};

Lewd.literal = function (literal) {
    assertParameterCount(arguments, 1);
    return condition.literal(literal);
};

Lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return condition.isoDateTime();
};

Lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return condition.integer();
};

Lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return condition.regex(regex);
};

Lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.all(args);
};

Lewd.Array = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(Array);
};

Lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.array(args);
};

Lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.none(args);
};

Lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(Object);
};

Lewd.String = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(String);
};

Lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(Number);
};

Lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(Boolean);
};

Lewd.null = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(null);
};

Lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return utils.wrap(undefined);
};

Lewd.set = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.set(new Set(args));
};

Lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return condition.not(value);
};

Lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.some(args);
};

Lewd.object = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return condition.object(spec, options);
};

module.exports = Lewd;
