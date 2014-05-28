var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException'),
    WrongParameterException = require('../exception/WrongParameterException'),
    anyCondition = require('./Any');

var KEYS_PROPERTY = '$k',
    VALUES_PROPERTY = '$v',
    REQUIRED = 'required',
    OPTIONAL = 'optional';

function validateOptions(options, allowExtraDefault) {
    var defaults = {
            allowExtra: allowExtraDefault,
            byDefault: REQUIRED,
            keys: undefined,
            values: undefined,
            sanitize: false
        },
        opts = _.defaults({}, options, defaults);
    
    if ([REQUIRED, OPTIONAL].indexOf(opts.byDefault) === -1) {
        throw new InvalidSchemaException('invalid value for option "byDefault"');
    }
    if (typeof opts.allowExtra !== 'boolean') {
        throw new InvalidSchemaException('option "allowExtra" must be a boolean');
    }
    if (typeof opts.sanitize !== 'boolean') {
        throw new InvalidSchemaException('option "sanitize" must be a boolean');
    }
    
    var unknownOptions = _.difference(Object.keys(options), Object.keys(defaults));
    if (unknownOptions.length > 0) {
        throw new InvalidSchemaException('unknown option: "' + unknownOptions[0] + '"');
    }
    
    return opts;
}

/**
 * @since 0.1.0
 * @param {*} object
 * @param {Objects=} option 
 * @return {function(*, Array.<string>)}
 */
module.exports = function (object, options) {
    // TODO: this could definitely use some refactoring
    
    var lewd = require('../lewd'),
        utils = require('../utils'),
        messages = require('../messages').Object;
    
    var opts = options || {};
        
    var keysCondition,
        valuesCondition,
        allowExtraDefault = false,
        definedKeys = Object.keys(object);

    if (opts.hasOwnProperty('keys')) {
        keysCondition = lewd._wrap(opts.keys);
        allowExtraDefault = true;
    } else if (object.hasOwnProperty(KEYS_PROPERTY)) {
        keysCondition = lewd._wrap(object[KEYS_PROPERTY]);
        definedKeys = _.without(definedKeys, KEYS_PROPERTY);
        allowExtraDefault = true;
    } else {
        keysCondition = anyCondition();
    }
    
    if (opts.hasOwnProperty('values')) {
        valuesCondition = lewd._wrap(opts.values);
        allowExtraDefault = true;
    } else if (object.hasOwnProperty(VALUES_PROPERTY)) {
        valuesCondition = lewd._wrap(object[VALUES_PROPERTY]);
        definedKeys = _.without(definedKeys, VALUES_PROPERTY);
        allowExtraDefault = true;
    } else {
        valuesCondition = anyCondition();
    }
    
    opts = validateOptions(opts, allowExtraDefault);
    
    var optionalKeys = [],
        requiredKeys = [];

    definedKeys.forEach(function (key) {
        object[key] = lewd._wrap(object[key]);
        object[key]._property = object[key]._property || opts.byDefault;
        
        if (object[key]._property === REQUIRED) {
            requiredKeys.push(key);
        }
        if (object[key]._property === OPTIONAL) {
            optionalKeys.push(key);
        }
    });
    
    return utils.customMessageWrapper(function objectCondition(value, path) {
        path = path || [];
        
        if (!_.isPlainObject(value)) {
            throw new ConditionViolationException(value, path, messages.type);
        }

        var actualKeys = Object.keys(value),
            extraKeys = _.difference(actualKeys, definedKeys),
            missingKeys = opts.byDefault === REQUIRED ?
                _.difference(definedKeys, optionalKeys, actualKeys) : _.difference(requiredKeys, actualKeys),
            keysToValidate = _.intersection(definedKeys, actualKeys);
        
        if (extraKeys.length > 0 && !opts.allowExtra) {
            if (opts.sanitize) {
                extraKeys.forEach(function (key) {
                    delete value[key];
                });
            } else {
                throw new ConditionViolationException(value, path, messages.unexpectedKey, { key: extraKeys[0] });
            }
        }
        if (missingKeys.length > 0) {
            throw new ConditionViolationException(value, path, messages.missingKey, { key: missingKeys[0] });
        }
        
        extraKeys.forEach(function (key) {
            if (opts.sanitize) {
                try {
                    keysCondition(key, path.concat(KEYS_PROPERTY + key));
                } catch (e) {
                    if (e instanceof ConditionViolationException) {
                        delete value[key];
                        return;
                    } else {
                        throw e;
                    }
                }
                valuesCondition(value[key], path.concat(KEYS_PROPERTY + key));
            } else {
                keysCondition(key, path.concat(KEYS_PROPERTY + key));
                valuesCondition(value[key], path.concat(KEYS_PROPERTY + key));
            }
        });
        
        keysToValidate.forEach(function (key) {
            object[key](value[key], path.concat(key));
        });
    });
};
