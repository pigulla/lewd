var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

function arrayTypeCondition(value, path) {
    if (!Array.isArray(value)) {
        throw new ConditionViolationException(value, path, 'not an array');
    }
}

function numberTypeCondition(value, path) {
    if (typeof value !== 'number') {
        throw new ConditionViolationException(value, path, 'not a number');
    }
}

function stringTypeCondition(value, path) {
    if (typeof value !== 'string') {
        throw new ConditionViolationException(value, path, 'not a string');
    }
}

function booleanTypeCondition(value, path) {
    if (typeof value !== 'boolean') {
        throw new ConditionViolationException(value, path, 'not a boolean');
    }
}

function objectTypeCondition(value, path) {
    if (!_.isPlainObject(value)) {
        throw new ConditionViolationException(value, path, 'not an object');
    }
}

function nullTypeCondition(value, path) {
    if (value !== null) {
        throw new ConditionViolationException(value, path, 'not null');
    }
}

module.exports = function (type) {
    switch (type) {
        case Array:
            return arrayTypeCondition;
        case Number:
            return numberTypeCondition;
        case String:
            return stringTypeCondition;
        case Boolean:
            return booleanTypeCondition;
        case Object:
            return objectTypeCondition;
        case null:
            return nullTypeCondition;
        default:
            throw new InvalidSchemaException('Invalid type constructor');
    }
};
