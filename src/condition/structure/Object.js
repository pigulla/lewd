var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    errorMessages = require('../../messages'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException');

var KEYS_PROPERTY = '$k',
    VALUES_PROPERTY = '$v';

function validateOptions(options, allowExtraDefault) {
    var defaults = {
            allowExtra: allowExtraDefault,
            byDefault: Condition.PROPERTY_STATE.REQUIRED,
            keys: undefined,
            values: undefined,
            removeExtra: false
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
function ObjectCondition (spec, options) {
    if (spec === null || typeof spec !== 'object') {
        throw new IllegalParameterException('Parameter must be an object');
    }
    
    Condition.call(this, 'Object');
    this.spec = spec;

    var lewd = require('../../lewd'),
        allowExtraDefault = false;

    this.opts = options || {};
    this.definedKeys = Object.keys(spec);

    function initProp(key, propName, PROPERTY) {
        if (this.opts.hasOwnProperty(key)) {
            this[propName] = lewd._wrap(this.opts[key]);
            allowExtraDefault = true;
        } else if (spec.hasOwnProperty(PROPERTY)) {
            this[propName] = lewd._wrap(spec[PROPERTY]);
            this.definedKeys = _.without(this.definedKeys, PROPERTY);
            allowExtraDefault = true;
        } else {
            this[propName] = lewd(undefined);
        }
    }
    
    initProp.call(this, 'keys', 'keysCondition', KEYS_PROPERTY);
    initProp.call(this, 'values', 'valuesCondition', VALUES_PROPERTY);

    this.options = validateOptions(this.opts, allowExtraDefault);
}

util.inherits(ObjectCondition, Condition);

ObjectCondition.prototype.prepare = function () {
    var lewd = require('../../lewd');

    this.forbiddenKeys = [];
    this.optionalKeys = [];
    this.requiredKeys = [];

    this.definedKeys.forEach(function (key) {
        this.spec[key] = lewd._wrap(this.spec[key]);

        var hasState = this.spec[key].isOptional() || this.spec[key].isRequired() || this.spec[key].isForbidden();

        if (!hasState && this.opts.byDefault === Condition.PROPERTY_STATE.REQUIRED) {
            this.spec[key].required();
        } else if (!hasState && this.opts.byDefault === Condition.PROPERTY_STATE.OPTIONAL) {
            this.spec[key].optional();
        }

        if (this.spec[key].isForbidden()) {
            this.forbiddenKeys.push(key);
        }
        if (this.spec[key].isRequired()) {
            this.requiredKeys.push(key);
        }
        if (this.spec[key].isOptional()) {
            this.optionalKeys.push(key);
        }
    }, this);
};

/**
 * @inheritdoc
 */
ObjectCondition.prototype.validate = function (value, path) {
    if (!_.isPlainObject(value)) {
        this.reject(value, path, errorMessages.Object.type);
    }
    
    // We need to do this every time in case the nested conditions' property states have changed
    this.prepare();

    var actualKeys = Object.keys(value),
        extraKeys = _.difference(actualKeys, this.definedKeys),
        missingKeys = this.options.byDefault === Condition.PROPERTY_STATE.REQUIRED ?
            _.difference(this.definedKeys, this.optionalKeys, this.forbiddenKeys, actualKeys) :
            _.difference(this.requiredKeys, actualKeys),
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
    
    this.optionalKeys.forEach(function (key) {
        if (actualKeys.indexOf(key) === -1 && this.spec[key].getDefault() !== undefined) {
            value[key] = this.spec[key].getDefault();
            keysToValidate.push(key);
        }
    }, this);

    keysToValidate.forEach(function (key) {
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
ObjectCondition.prototype.find = function (name) {
    var result = Condition.prototype.find.call(this, name);
    
    Array.prototype.push.apply(result, this.keysCondition.find(name));
    Array.prototype.push.apply(result, this.valuesCondition.find(name));

    this.definedKeys.forEach(function (key) {
        var found = this.spec[key].find(name);
        Array.prototype.push.apply(result, found);
    }.bind(this));

    return result;
};

module.exports = ObjectCondition;
