var _ = require('lodash');

var ConditionLockedException = require('../exception/ConditionLockedException'),
    ConditionViolationException = require('../exception/ConditionViolationException'),
    IllegalParameterException = require('../exception/IllegalParameterException');

/**
 * @abstract
 * @class lewd.condition.Condition 
 * @constructor
 * @param {string} type
 */
function Condition(type) {
    this._coerce = false;
    this._customError = null;
    this._default = undefined;
    this._locked = false;
    this._name = null;
    this._state = null;
    this._type = type;
    this._wrapper = null;
}

/**
 * Constants used by `setPropertyState`.
 * 
 * @type {Object.<string, string>}
 */
Condition.PROPERTY_STATE = {
    UNSPECIFIED: 'unspecified',
    FORBIDDEN: 'forbidden',
    REQUIRED: 'required',
    OPTIONAL: 'optional'
};

/* jshint -W030 */
/**
 * Internal flag to indicate whether coercion is enabled.
 * 
 * @protected
 * @type {boolean}
 */
Condition.prototype._coerce;

/**
 * The custom error message or `null` if the default message is to be used.
 *
 * @protected
 * @type {(string|null)}
 */
Condition.prototype._customError;

/**
 * The default value for object properties.
 *
 * @private
 * @type {*}
 */
Condition.prototype._default;

/**
 * The "locked" flag.
 *
 * @private
 * @type {boolean}
 */
Condition.prototype._locked;

/**
 * The user-defined name of the condition.
 *
 * @private
 * @type {?string}
 */
Condition.prototype._name;

/**
 * The required/optional state for object properties.
 * 
 * @private
 * @type {string}
 */
Condition.prototype._state;

/**
 * The (hopefully unique) type of the condition.
 *
 * @readonly
 * @protected
 * @type {string}
 */
Condition.prototype._type;

/**
 * The consumer wrapper.
 *
 * @private
 * @type {?lewd.condition.ConsumerWrapper}
 */
Condition.prototype._wrapper;
/* jshint +W030 */

/**
 * Asserts that the condition has not been locked.
 * 
 * @private
 * @throws {lewd.exception.ConditionLockedException}
 */
Condition.prototype._assertNotLocked = function () {
    if (this._locked) {
        throw new ConditionLockedException();
    }
};

/**
 * Returns this condition's internal type.
 * 
 * @return {string}
 */
Condition.prototype.getType = function () {
    return this._type;
};

/**
 * The actual validation function. Must return the input value (or its coerced version).
 * 
 * @abstract
 * @param {*} value
 * @param {Array.<(string|number)>} path
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
 * @param {Array.<(string|number)>} path
 * @param {string} messageTemplate
 * @param {Object.<string, *>=} templateData
 * @throws {lewd.exception.ConditionViolationException}
 */
Condition.prototype.reject = function (value, path, messageTemplate, templateData) {
    var data = templateData || {},
        error = this._customError ? this._customError : messageTemplate;
    
    if (this._customError) {
        data.originalMessage = messageTemplate;
    }
    
    throw new ConditionViolationException(value, path, error, data);
};

/**
 * Get a condition by its user-assigned name. Returns an array containing this instance if the name matches and an empty
 * array otherwise.
 *  
 * @param {string} name
 * @return {Array.<lewd.condition.ConsumerWrapper>}
 */
Condition.prototype.find = function (name) {
    return this._name === name ? [this.consumer()] : [];
};

/**
 * Locks the condition to prevent it or its nested conditions from being modified (e.g., changing the default value).
 *  
 * @return {lewd.condition.Condition}
 */
Condition.prototype.lock = function () {
    this._locked = true;
    return this;
};

/**
 * Set a custom error message.
 * 
 * @param {?string} messageTemplate
 * @return {lewd.condition.Condition}
 * @throws {lewd.exception.ConditionLockedException}
 */
Condition.prototype.setCustomMessage = function (messageTemplate) {
    this._assertNotLocked();
    this._customError = messageTemplate;
    return this;
};

/**
 * Sets the conditions user-defined name.
 * 
 * @param {string} name
 * @return {lewd.condition.Condition}
 * @throws {lewd.exception.ConditionLockedException}
 */
Condition.prototype.setName = function (name) {
    this._assertNotLocked();
    this._name = name;
    return this;
};

/**
 * Check whether coercion is enabled.
 * 
 * @return {boolean}
 */
Condition.prototype.isCoercionEnabled = function () {
    return this._coerce;
};

/**
 * Enable or disable coercion.
 * 
 * @param {boolean} enabled
 * @return {lewd.condition.Condition}
 * @throws {lewd.exception.ConditionLockedException}
 */
Condition.prototype.setCoercionEnabled = function (enabled) {
    this._assertNotLocked();

    if (!this.supportsCoercion) {
        throw new IllegalParameterException('Condition does not support coercion');
    }
    
    this._coerce = !!enabled;
    return this;
};

/**
 * Gets the property state.
 * 
 * @return {string}
 */
Condition.prototype.getPropertyState = function () {
    return this._state;
};

/**
 * Sets the property state, i.e. whether the value associated with this condition is required or optional (or neither)
 * when used as an object property (ignored if it is not).
 * 
 * @param {string} state
 * @return {lewd.condition.Condition}
 * @throws {lewd.exception.ConditionLockedException}
 */
Condition.prototype.setPropertyState = function (state) {
    this._assertNotLocked();
    this._state = state;
    return this;
};

/**
 * Gets the default value when used as an object property.
 * 
 * @return {*}
 */
Condition.prototype.getDefaultValue = function () {
    return this._default;
};

/**
 * Sets the default value when used as an object property (ignored if it is not).
 * 
 * @param {*} value
 * @return {lewd.condition.Condition}
 * @throws {lewd.exception.ConditionLockedException}
 */
Condition.prototype.setDefaultValue = function (value) {
    this._assertNotLocked();
    this._default = value;
    return this;
};

/**
 * Returns a "consumer" object of this condition that hides away the internals and provides convenience methods.
 * 
 * @return {lewd.condition.ConsumerWrapper}
 */
Condition.prototype.consumer = function () {
    if (!this._wrapper) {
        this._wrapper = require('./ConsumerWrapper').wrap(this);
    }
    
    return this._wrapper;
};

module.exports = Condition;
