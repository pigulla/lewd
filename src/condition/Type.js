var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException'),
    anyCondition = require('./Any'),
    message = require('../messages').Type;

function arrayTypeCondition(value, path) {
    if (!Array.isArray(value)) {
        throw new ConditionViolationException(value, path, message, { type: 'array' });
    }
}

function numberTypeCondition(value, path) {
    if (typeof value !== 'number') {
        throw new ConditionViolationException(value, path, message, { type: 'number' });
    }
}

function stringTypeCondition(value, path) {
    if (typeof value !== 'string') {
        throw new ConditionViolationException(value, path, message, { type: 'string' });
    }
}

function booleanTypeCondition(value, path) {
    if (typeof value !== 'boolean') {
        throw new ConditionViolationException(value, path, message, { type: 'boolean' });
    }
}

function objectTypeCondition(value, path) {
    if (!_.isPlainObject(value)) {
        throw new ConditionViolationException(value, path, message, { type: 'object' });
    }
}

function nullTypeCondition(value, path) {
    if (value !== null) {
        throw new ConditionViolationException(value, path, message, { type: 'null' });
    }
}

module.exports = function (type) {
    var utils = require('../utils'),
        fn;
    
    switch (type) {
        case Array:
            fn = arrayTypeCondition;
            break;
        case Number:
            fn = numberTypeCondition;
            break;
        case String:
            fn = stringTypeCondition;
            break;
        case Boolean:
            fn = booleanTypeCondition;
            break;
        case Object:
            fn = objectTypeCondition;
            break;
        case null:
            fn = nullTypeCondition;
            break;
        case undefined:
            fn = anyCondition;
            break;
        default:
            throw new InvalidSchemaException('Invalid type constructor');
    }
    
    return utils.customMessageWrapper(fn);
};
