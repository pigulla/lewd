var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    errorMessages = require('../../messages'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    utils = require('../../utils');

var KEYS_PROPERTY = '$k',
    VALUES_PROPERTY = '$v';

/**
 * Validates the given options.
 * 
 * @throws IllegalParameterException
 * @param {Object} options
 * @param {boolean} allowExtraDefault
 * @return {Object}
 */
function validateOptions(options, allowExtraDefault) {
    var defaults = {
            allowExtra: allowExtraDefault,
            byDefault: Condition.PROPERTY_STATE.REQUIRED,
            keys: undefined,
            values: undefined,
            removeExtra: false,
            ignoreExtraFunctions: false
        },
        opts = _.defaults({}, options, defaults);

    if ([Condition.PROPERTY_STATE.REQUIRED, Condition.PROPERTY_STATE.OPTIONAL].indexOf(opts.byDefault) === -1) {
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
 * @param {object} spec
 * @param {object=} options
 */
function ObjectCondition(spec, options) {
    if (spec === null || typeof spec !== 'object') {
        throw new IllegalParameterException('Parameter must be an object');
    }
    
    Condition.call(this, 'Object');

    var lewd = require('../../lewd'),
        allowExtraDefault = false;

    this.spec = spec;
    this.opts = options || {};
    this.definedKeys = Object.keys(spec);

    /**
     * Normalizes the generic key and value conditions and determines what the default value for the "allowExtra"
     * option should be.
     * 
     * @param {string} key
     * @param {string} property
     */
    function initKeyValueConditions(key, property) {
        var propertyName = key + 'Condition';

        if (this.opts.hasOwnProperty(key)) {
            // If 'keys' or 'values' is specified in the options it takes precedence over the corresponding $key or
            // $value property in the spec.
            this[propertyName] = lewd._wrap(this.opts[key]);
            allowExtraDefault = true;
            
        } else if (spec.hasOwnProperty(property)) {
            this[propertyName] = lewd._wrap(spec[property]);
            // Remove the special value since its not actually a key.
            this.definedKeys = _.without(this.definedKeys, property);
            allowExtraDefault = true;
            
        } else {
            // No generic constraints are put on the keys or values, so we accept anything.
            this[propertyName] = lewd(undefined);
        }
    }
    
    initKeyValueConditions.call(this, 'keys', KEYS_PROPERTY);
    initKeyValueConditions.call(this, 'values', VALUES_PROPERTY);

    this.options = validateOptions(this.opts, allowExtraDefault);

    // Auto-wrap where necessary
    Object.keys(this.spec).forEach(function (key) {
        this.spec[key] = lewd._wrap(this.spec[key]);
    }, this);
}

util.inherits(ObjectCondition, Condition);

/* jshint -W030 */
/**
 * The condition for generic key validation ($k). Initialized in initKeyValueConditions().
 * 
 * @type {lewd.condition.ConsumerWrapper} 
 */
ObjectCondition.prototype.keysCondition;

/**
 * The condition for generic value validation ($v). Initialized in initKeyValueConditions().
 * 
 * @type {lewd.condition.ConsumerWrapper}
 */
ObjectCondition.prototype.valuesCondition;
/* jshint +W030 */

/**
 * Marks all keys properties as being optional.
 * 
 * @since 0.7.0
 */
ObjectCondition.prototype.allOptional = function () {
    Object.keys(this.spec).forEach(function (key) {
        this.spec[key].optional();
    }, this);
};

/**
 * Marks all keys properties as being required.
 *
 * @since 0.7.0
 */
ObjectCondition.prototype.allRequired = function () {
    Object.keys(this.spec).forEach(function (key) {
        this.spec[key].required();
    }, this);
};

/**
 * Calculate various sets of keys needed to do the actual validation. This calculation needs to be re-done whenever
 * a value is validated because the underlying property conditions might have changed (e.g., from initially being
 * optional to now being required).
 * 
 * @private
 * @param {object} value
 * @return {object}
 */
ObjectCondition.prototype._calculateKeys = function (value) {
    var keys = {
        actual: null,
        extra: null,
        missing: null,
        toValidate: null,
        forbidden: [],
        optional: [],
        required: []
    };
    
    keys.actual = utils.getEnumerableProperties(value);
    keys.extra = _.difference(keys.actual, this.definedKeys);
    keys.toValidate = _.intersection(this.definedKeys, keys.actual);
    
    this.definedKeys.forEach(function (key) {
        var hasState = this.spec[key].isOptional() || this.spec[key].isRequired() || this.spec[key].isForbidden();

        if (!hasState && this.opts.byDefault === Condition.PROPERTY_STATE.REQUIRED) {
            this.spec[key].required();
        } else if (!hasState && this.opts.byDefault === Condition.PROPERTY_STATE.OPTIONAL) {
            this.spec[key].optional();
        }

        if (this.spec[key].isForbidden()) {
            keys.forbidden.push(key);
        } else if (this.spec[key].isRequired()) {
            keys.required.push(key);
        } else if (this.spec[key].isOptional()) {
            keys.optional.push(key);
        }
    }, this);

    keys.missing = this.options.byDefault === Condition.PROPERTY_STATE.REQUIRED ?
        _.difference(this.definedKeys, keys.optional, keys.forbidden, keys.actual) :
        _.difference(keys.required, keys.actual);

    return keys;
};

/**
 * @inheritdoc
 */
ObjectCondition.prototype.validate = function (value, path) {
    if (!utils.isBasicObject(value)) {
        this.reject(value, path, errorMessages.Object.type);
    }
    
    var keys = this._calculateKeys(value);

    // Check unexpected keys and remove them or throw an error depending on the settings.
    if (keys.extra.length > 0 && !this.options.allowExtra) {
        if (this.options.removeExtra) {
            keys.extra.forEach(function (key) {
                delete value[key];
            });
        } else {
            var extraFiltered = keys.extra.filter(function (key) {
                return !this.options.ignoreExtraFunctions || typeof value[key] !== 'function';
            }, this);
            
            if (extraFiltered.length) { 
                this.reject(value, path, errorMessages.Object.unexpectedKey, { key: extraFiltered[0] });
            }
        }
    }
    
    // Check missing keys
    if (keys.missing.length > 0) {
        this.reject(value, path, errorMessages.Object.missingKey, { key: keys.missing[0] });
    }

    // Validate extra keys. 
    keys.extra.forEach(function (key) {
        if (this.options.ignoreExtraFunctions && typeof value[key] === 'function') {
            return;
        }
        
        if (this.options.removeExtra) {
            try {
                this.keysCondition(key, path.concat('{' + key + '}'));
            } catch (e) {
                if (e instanceof ConditionViolationException) {
                    delete value[key];
                    return;
                } else {
                    throw e;
                }
            }
            this.valuesCondition(value[key], path.concat(key));
        } else {
            this.keysCondition(key, path.concat('{' + key + '}'));
            this.valuesCondition(value[key], path.concat(key));
        }
    }, this);
    
    // If any of the optional keys with a defined default is missing, assign that default.
    keys.optional.forEach(function (key) {
        var defaultValue = this.spec[key].getDefault();
        
        if (keys.actual.indexOf(key) === -1 && defaultValue !== undefined) {
            value[key] = defaultValue;
            keys.toValidate.push(key);
        }
    }, this);

    // Do the actual validation of the defined values.
    keys.toValidate.forEach(function (key) {
        if (this.spec[key].isForbidden()) {
            this.reject(value, path, errorMessages.Object.unexpectedKey, { key: key });
        }
        value[key] = this.spec[key](value[key], path.concat(key));
    }, this);

    return value;
};

/**
 * @inheritdoc
 */
ObjectCondition.prototype.lock = function () {
    this.keysCondition.lock();
    this.valuesCondition.lock();

    this.definedKeys.forEach(function (key) {
        this.spec[key].lock();
    }, this);

    return this;
};

/**
 * @inheritdoc
 */
ObjectCondition.prototype.find = function (name) {
    var result = Condition.prototype.find.call(this, name);
    
    Array.prototype.push.apply(result, this.keysCondition.find(name));
    Array.prototype.push.apply(result, this.valuesCondition.find(name));

    this.definedKeys.forEach(function (key) {
        var found = this.spec[key].find(name);
        Array.prototype.push.apply(result, found);
    }, this);

    return result;
};

module.exports = ObjectCondition;
