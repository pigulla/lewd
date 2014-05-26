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
        dict: require('./condition/Dict'),
        integer: require('./condition/composite/Integer'),
        isoDateTime: require('./condition/composite/IsoDateTime'),
        len: require('./condition/Len'),
        literal: require('./condition/Literal'),
        none: require('./condition/None'),
        not: require('./condition/Not'),
        range: require('./condition/Range'),
        regex: require('./condition/Regex'),
        set: require('./condition/Set'),
        some: require('./condition/Some')
    };

// TODO: show source
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

var Lewd = function (spec) {
    assertParameterCount(arguments, 1);
    
    return utils.customMessageWrapper(utils.wrap(spec));
};

Lewd.expose = function (prefix) {
    var p = prefix || '$',
        exposedFunctions = [
            'specify', 'range', 'len', 'regex', 'all', 'set', 'some', 'none', 'literal', 'dict', 'not', 'isoDateTime',
            'integer'
        ];
    
    (function () {
        for (var i = 0; i < exposedFunctions.length; ++i) {
            this[p + exposedFunctions[i]] = Lewd[exposedFunctions[i]];
        }
    }).call(null);
};

Lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return utils.customMessageWrapper(condition.range(options));
};

Lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return utils.customMessageWrapper(condition.len(options));
};

Lewd.literal = function (literal) {
    assertParameterCount(arguments, 1);
    return utils.customMessageWrapper(condition.literal(literal));
};

Lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(condition.isoDateTime());
};

Lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(condition.integer());
};

Lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return utils.customMessageWrapper(condition.regex(regex));
};

Lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return utils.customMessageWrapper(condition.all(args));
};

Lewd.Array = function () {
    var args = Array.prototype.slice.call(arguments);
    return utils.customMessageWrapper(condition.array(args));
};

Lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return utils.customMessageWrapper(condition.none(args));
};

Lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(utils.wrap(Object));
};

Lewd.String = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(utils.wrap(String));
};

Lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(utils.wrap(Number));
};

Lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(utils.wrap(Boolean));
};

Lewd.null = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(utils.wrap(null));
};

Lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return utils.customMessageWrapper(utils.wrap(undefined));
};

Lewd.set = function () {
    var args = Array.prototype.slice.call(arguments);
    return utils.customMessageWrapper(condition.set(new Set(args)));
};

Lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return utils.customMessageWrapper(condition.not(value));
};

Lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return utils.customMessageWrapper(condition.some(args));
};

Lewd.dict = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return utils.customMessageWrapper(condition.dict(spec, options));
};

module.exports = Lewd;
