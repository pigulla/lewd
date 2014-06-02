var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    errorMessages = require('../../messages'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException');

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
            removeExtra: false
        },
        opts = _.defaults({}, options, defaults);

    if ([REQUIRED, OPTIONAL].indexOf(opts.byDefault) === -1) {
        throw new IllegalParameterException('invalid value for option "byDefault"');
    }
    if (typeof opts.allowExtra !== 'boolean') {
        throw new IllegalParameterException('option "allowExtra" must be a boolean');
    }
    if (typeof opts.removeExtra !== 'boolean') {
        throw new IllegalParameterException('option "removeExtra" must be a boolean');
    }

    var unknownOptions = _.difference(Object.keys(options), Object.keys(defaults));
    if (unknownOptions.length > 0) {
        throw new IllegalParameterException('unknown option: "' + unknownOptions[0] + '"');
    }

    return opts;
}

/**
 * @class lewd.condition.content.Object
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function ObjectCondition (spec, options) {
    Condition.call(this, 'Object');
    this.spec = spec;

    var lewd = require('../../lewd');

    var opts = options || {},
        allowExtraDefault = false;
    
    this.definedKeys = Object.keys(spec);

    if (opts.hasOwnProperty('keys')) {
        this.keysCondition = lewd._wrap(opts.keys);
        allowExtraDefault = true;
    } else if (spec.hasOwnProperty(KEYS_PROPERTY)) {
        this.keysCondition = lewd._wrap(spec[KEYS_PROPERTY]);
        this.definedKeys = _.without(this.definedKeys, KEYS_PROPERTY);
        allowExtraDefault = true;
    } else {
        this.keysCondition = lewd(undefined);
    }

    if (opts.hasOwnProperty('values')) {
        this.valuesCondition = lewd._wrap(opts.values);
        allowExtraDefault = true;
    } else if (spec.hasOwnProperty(VALUES_PROPERTY)) {
        this.valuesCondition = lewd._wrap(spec[VALUES_PROPERTY]);
        this.definedKeys = _.without(this.definedKeys, VALUES_PROPERTY);
        allowExtraDefault = true;
    } else {
        this.valuesCondition = lewd(undefined);
    }

    this.options = validateOptions(opts, allowExtraDefault);

    this.optionalKeys = [];
    this.requiredKeys = [];

    this.definedKeys.forEach(function (key) {
        spec[key] = lewd._wrap(spec[key]);
        
        if (!spec[key].isOptional() && !spec[key].isRequired() && opts.byDefault === REQUIRED) {
            spec[key].required();
        } else if (!spec[key].isOptional() && !spec[key].isRequired() && opts.byDefault === OPTIONAL) {
            spec[key].optional();
        }

        if (spec[key].isRequired()) {
            this.requiredKeys.push(key);
        }
        if (spec[key].isOptional()) {
            this.optionalKeys.push(key);
        }
    }, this);
}

util.inherits(ObjectCondition, Condition);

/**
 * @inheritdoc
 */
ObjectCondition.prototype.validate = function (value, path) {
    if (!_.isPlainObject(value)) {
        this.reject(value, path, errorMessages.Object.type);
    }

    var actualKeys = Object.keys(value),
        extraKeys = _.difference(actualKeys, this.definedKeys),
        missingKeys = this.options.byDefault === REQUIRED ?
            _.difference(this.definedKeys, this.optionalKeys, actualKeys) : _.difference(this.requiredKeys, actualKeys),
        keysToValidate = _.intersection(this.definedKeys, actualKeys);

    if (extraKeys.length > 0 && !this.options.allowExtra) {
        if (this.options.removeExtra) {
            extraKeys.forEach(function (key) {
                delete value[key];
            });
        } else {
            this.reject(value, path, errorMessages.Object.unexpectedKey, { key: extraKeys[0] });
        }
    }
    if (missingKeys.length > 0) {
        this.reject(value, path, errorMessages.Object.missingKey, { key: missingKeys[0] });
    }

    extraKeys.forEach(function (key) {
        if (this.options.removeExtra) {
            try {
                this.keysCondition(key, path.concat(KEYS_PROPERTY + key));
            } catch (e) {
                if (e instanceof ConditionViolationException) {
                    delete value[key];
                    return;
                } else {
                    throw e;
                }
            }
            this.valuesCondition(value[key], path.concat(KEYS_PROPERTY + key));
        } else {
            this.keysCondition(key, path.concat(KEYS_PROPERTY + key));
            this.valuesCondition(value[key], path.concat(KEYS_PROPERTY + key));
        }
    }, this);

    keysToValidate.forEach(function (key) {
        this.spec[key](value[key], path.concat(key));
    }, this);

    return value;
};

module.exports = ObjectCondition;
