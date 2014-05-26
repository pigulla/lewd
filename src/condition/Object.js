var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException'),
    UnexpectedParameterException = require('../exception/UnexpectedParameterException'),
    anyCondition = require('./Any');

var KEYS_PROPERTY = '$k',
    VALUES_PROPERTY = '$v',
    REQUIRED = 'required',
    OPTIONAL = 'optional';

function validateOptions(options, definedKeys, allowExtraDefault) {
    var opts = _.defaults({}, options, {
        allowExtra: allowExtraDefault,
        byDefault: REQUIRED,
        optional: [],
        required: [],
        keys: undefined,
        values: undefined
    });
    
    if ([REQUIRED, OPTIONAL].indexOf(opts.byDefault) === -1) {
        throw new InvalidSchemaException('Invalid value for option "byDefault"');
    }

    if (opts.byDefault === REQUIRED && options.hasOwnProperty('required')) {
        throw new InvalidSchemaException('Option "required" not allowed if "byDefault" is set to "required"');
    }
    if (opts.byDefault === OPTIONAL && options.hasOwnProperty('optional')) {
        throw new InvalidSchemaException('Option "optional" not allowed if "byDefault" is set to "optional"');
    }
    
    if (typeof opts.allowExtra !== 'boolean') {
        throw new InvalidSchemaException('Option "allowExtra" must be a boolean');
    }
    if (!Array.isArray(opts.optional)) {
        throw new InvalidSchemaException('Option "optional" must be an array');
    }
    if (!Array.isArray(opts.required)) {
        throw new InvalidSchemaException('Option "required" must be an array');
    }
    
    var unknownRequired = _.difference(opts.required, definedKeys),
        unknownOptional = _.difference(opts.optional, definedKeys);
    
    if (unknownRequired.length > 0) {
        throw new InvalidSchemaException('Key "' + unknownRequired[0] + '" is marked as required but was not defined');
    }
    if (unknownOptional.length > 0) {
        throw new InvalidSchemaException('Key "' + unknownOptional[0] + '" is marked as optional but was not defined');
    }
    
    return opts;
}

module.exports = function (object, options) {
    // TODO: this could definitely use some refactoring
    
    var utils = require('../utils');
    
    var opts = options || {};
    
    if (!_.isPlainObject(object)) {
        throw new UnexpectedParameterException('Parameter must be a plain object');
    }
    
    var keysCondition,
        valuesCondition,
        allowExtraDefault = false,
        definedKeys = Object.keys(object);

    if (opts.hasOwnProperty('keys')) {
        keysCondition = utils.wrap(opts.keys);
        allowExtraDefault = true;
    } else if (object.hasOwnProperty(KEYS_PROPERTY)) {
        keysCondition = utils.wrap(object[KEYS_PROPERTY]);
        definedKeys = _.without(definedKeys, KEYS_PROPERTY);
        allowExtraDefault = true;
    } else {
        keysCondition = anyCondition();
    }
    
    if (opts.hasOwnProperty('values')) {
        valuesCondition = utils.wrap(opts.values);
        allowExtraDefault = true;
    } else if (object.hasOwnProperty(VALUES_PROPERTY)) {
        valuesCondition = utils.wrap(object[VALUES_PROPERTY]);
        definedKeys = _.without(definedKeys, VALUES_PROPERTY);
        allowExtraDefault = true;
    } else {
        valuesCondition = anyCondition();
    }
    
    opts = validateOptions(opts, Object.keys(object), allowExtraDefault);

    definedKeys.forEach(function (key) {
        object[key] = utils.wrap(object[key]);
    });
    
    return function objectCondition(value, path) {
        path = path || [];
        
        if (!_.isPlainObject(value)) {
            throw new ConditionViolationException(value, path, 'not an object');
        }

        var actualKeys = Object.keys(value),
            extraKeys = _.difference(actualKeys, definedKeys),
            missingKeys = opts.byDefault === REQUIRED ?
                _.difference(definedKeys, opts.optional, actualKeys) : _.difference(opts.required, actualKeys),
            keysToValidate = _.intersection(definedKeys, actualKeys);

        if (extraKeys.length > 0 && !opts.allowExtra) {
            throw new ConditionViolationException(extraKeys[0], path, 'key was not expected');
        }
        if (missingKeys.length > 0) {
            throw new ConditionViolationException(missingKeys[0], path, 'key is required');
        }

        extraKeys.forEach(function (key) {
            keysCondition(key, path.concat(KEYS_PROPERTY + key));
            valuesCondition(value[key], path.concat(KEYS_PROPERTY + key));
        });
        
        keysToValidate.forEach(function (key) {
            object[key](value[key], path.concat(key));
        });
    };
};
