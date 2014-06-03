var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    IllegalParameterException = require('../exception/IllegalParameterException');

/**
 * @class lewd.condition.Condition 
 * @constructor
 * @param {string} name
 */
var Condition = function (name) {
    this.name = name;
    this.state = null;
    this.default = undefined;
    this.coerce = false;
    this.customError = null;
};

/**
 * Constants used by `setPropertyState`.
 * 
 * @type {Object.<string, string>}
 */
Condition.PROPERTY_STATE = {
    UNSPECIFIED: 'unspecified',
    REQUIRED: 'required',
    OPTIONAL: 'optional'
};

/* jshint -W030 */
/**
 * The (hopefully unique) name of the condition.
 * 
 * @type {string}
 */
Condition.prototype.name;

/**
 * The required/optional state for object properties.
 * 
 * @type {string}
 */
Condition.prototype.state;

/**
 * The default value for object properties.
 * 
 * @type {*}
 */
Condition.prototype.default;

/**
 * Internal flag to indicate whether coercion is enabled.
 * 
 * @type {boolean}
 */
Condition.prototype.coerce;

/**
 * The custom error message or `null` if the default message is to be used.
 * 
 * @type {(string|null)}
 */
Condition.prototype.customError;
/* jshint +W030 */

/**
 * The actual validation function. Must return the input value (or its coerced version).
 * 
 * @abstract
 * @param {*} value
 * @param {Array.<string>} path
 * @return {*}
 * @throws {lewd.exception.ConditionViolationException}
 */
Condition.prototype.validate = function (value, path) {
    throw new Error('Condition must overwrite its validate() method');
};

/**
 * Wrapper function for rejecting a value by throwing the appropriate exception.
 * Takes care of overriding the passed message with the custom message if needed.
 * 
 * @param {*} value
 * @param {Array.<string>} path
 * @param {string} messageTemplate
 * @param {Object.<string, *>=} templateData
 * @throws {lewd.exception.ConditionViolationException}
 */
Condition.prototype.reject = function (value, path, messageTemplate, templateData) {
    var data = templateData || {},
        error = this.customError ? this.customError : messageTemplate;
    
    if (this.customError) {
        data.originalMessage = messageTemplate;
    }
    
    throw new ConditionViolationException(value, path, error, data);
};

/**
 * Set a custom error message.
 * 
 * @param {string} messageTemplate
 * @return {lewd.condition.Condition}
 */
Condition.prototype.setCustomMessage = function (messageTemplate) {
    this.customError = messageTemplate;
    return this;
};

/**
 * Enable or disable coercion.
 * 
 * @param {boolean} enabled
 * @return {lewd.condition.Condition}
 */
Condition.prototype.setCoercionEnabled = function (enabled) {
    if (!this.supportsCoercion) {
        throw new IllegalParameterException('Condition does not support coercion');
    }
    
    this.coerce = !!enabled;
    return this;
};

/**
 * Sets the property state, i.e. whether the value associated with this condition is required or optional (or neither)
 * when used as an object property (ignored if it is not).
 * 
 * @param {string} state
 * @return {lewd.condition.Condition}
 */
Condition.prototype.setPropertyState = function (state) {
    this.state = state;
    return this;
};

/**
 * Sets the default value when used as an object property (ignored if it is not).
 * 
 * @param {*} value
 * @return {lewd.condition.Condition}
 */
Condition.prototype.setDefaultValue = function (value) {
    this.default = value;
    return this;
};

/**
 * Returns a "consumer" object of this condition that hides away the internals and provides convenience methods.
 * 
 * @return {lewd.condition.ConsumerCondition}
 */
Condition.prototype.consumer = function () {
    var self = this,
        wrapper = function consumerWrapper(value, path) {
            // do not use Function.bind() here because it will reset the function's name
            return self.validate.call(self, value, path || []);
        };
    
    _.assign(wrapper, {
        wrapped: this.name,
        because: function (reason) {
            self.setCustomMessage(reason);
            return wrapper;
        },
        default: function (value) {
            self.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            self.setDefaultValue(value);
            return wrapper;
        },
        getDefault: function () {
            return self.default;
        },
        coerce: function () {
            self.setCoercionEnabled(true);
            return wrapper;
        },
        optional: function () {
            self.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            return wrapper;
        },
        required: function () {
            self.setPropertyState(Condition.PROPERTY_STATE.REQUIRED);
            return wrapper;
        },
        isOptional: function () {
            return self.state === Condition.PROPERTY_STATE.OPTIONAL;
        },
        isRequired: function () {
            return self.state === Condition.PROPERTY_STATE.REQUIRED;
        }
    });
    
    return wrapper;
};

module.exports = Condition;

