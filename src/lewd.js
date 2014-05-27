var _ = require('lodash'),
    Set = require('harmony-collections').Set;

var util = require('util');

var ConditionViolationException = require('./exception/ConditionViolationException'),
    WrongParameterException = require('./exception/WrongParameterException'),
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
        some: require('./condition/Some'),
        type: require('./condition/Type')
    };

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
 * @param {*} spec
 * @return {function}
 */
lewd._wrap = function (spec) {
    if (utils.isJsonType(spec) || spec === undefined) {
        return condition.type(spec);
    }

    if (utils.isLiteral(spec)) {
        return condition.literal(spec);
    }
    
    if (spec instanceof Set) {
        var values = [];
        spec.forEach(function (item) {
            if (!utils.isLiteral(item)) {
                throw new InvalidSchemaException('Set must only contain literals'); 
            }
            values.push(condition.literal(item));
        });
        return condition.some(values);
    }

    if (spec instanceof RegExp) {
        return condition.regex(spec);
    }

    if (Array.isArray(spec)) {
        return condition.array(spec.map(lewd._wrap));
    }

    if (_.isPlainObject(spec)) {
        return condition.object(spec);
    }

    if (typeof spec === 'function') {
        if (spec.hasOwnProperty('because')) {
            return spec;
        } else {
            // custom condition
            return utils.customMessageWrapper(spec);
        }
    }

    /* istanbul ignore next */
    throw new InvalidSchemaException('Invalid specification');
};

/* istanbul ignore next */
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

lewd.range = function (options) {
    assertParameterCount(arguments, 1);
    return condition.range(options);
};

lewd.len = function (options) {
    assertParameterCount(arguments, 1);
    return condition.len(options);
};

lewd.literal = function (literal) {
    assertParameterCount(arguments, 1);
    return condition.literal(literal);
};

lewd.isoDateTime = function () {
    assertParameterCount(arguments, 0);
    return condition.isoDateTime();
};

lewd.integer = function () {
    assertParameterCount(arguments, 0);
    return condition.integer();
};

lewd.regex = function (regex) {
    assertParameterCount(arguments, 1);
    return condition.regex(regex);
};

lewd.all = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.all(args);
};

lewd.Array = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Array);
};

lewd.array = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.array(args);
};

lewd.none = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.none(args);
};

lewd.Object = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Object);
};

lewd.String = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(String);
};

lewd.Number = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Number);
};

lewd.Boolean = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(Boolean);
};

lewd.null = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(null);
};

lewd.undefined = function () {
    assertParameterCount(arguments, 0);
    return lewd._wrap(undefined);
};

lewd.not = function (value) {
    assertParameterCount(arguments, 1);
    return condition.not(value);
};

lewd.some = function () {
    var args = Array.prototype.slice.call(arguments);
    return condition.some(args);
};

lewd.object = function (spec, options) {
    assertParameterCount(arguments, 1, 2);
    return condition.object(spec, options);
};

module.exports = lewd;
