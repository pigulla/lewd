var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

/**
 * @class lewd.Condition 
 * @constructor
 * @param {string} name
 */
var Condition = function (name) {
    this.name = name;
    this.state = null;
    this.coerce = false;
    this.customError = null;
    this.supportsCoercion = false;
};

/**
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
 * @type {string}
 */
Condition.prototype.name;

/**
 * @type {string}
 */
Condition.prototype.name;

/**
 * @type {boolean}
 */
Condition.prototype.coerce;

/**
 * @type {string}
 */
Condition.prototype.customError;

/**
 * @type {boolean}
 */
Condition.prototype.supportsCoercion;

/* jshint +W030 */

/* istanbul ignore next */
/**
 * @abstract
 * @param {*} value
 * @param {Array.<string>} path
 */
Condition.prototype.validate = function (value, path) {
    throw new Error('Condition must overwrite its validate() method');
};

/**
 * 
 * @param {*} value
 * @param {Array.<string>} path
 * @param {string} messageTemplate
 * @param {Object.<string, *>=} templateData
 * @throws {lewd.ConditionViolationException}
 */
Condition.prototype.reject = function (value, path, messageTemplate, templateData) {
    var data = templateData || {};
    
    if (this.customError) {
        data.originalMessage = messageTemplate;
    }
    
    throw new ConditionViolationException(
        value,
        path,
        this.customError ? this.customError : messageTemplate,
        data
    );
};

/**
 * 
 * @param {string} messageTemplate
 * @return {lewd.Condition}
 */
Condition.prototype.setCustomMessage = function (messageTemplate) {
    this.customError = messageTemplate;
    return this;
};

/**
 * 
 * @param {boolean} enabled
 * @return {lewd.Condition}
 */
Condition.prototype.setCoercionEnabled = function (enabled) {
    if (!this.supportsCoercion) {
        throw new InvalidSchemaException('Condition does not support coercion');
    }
    
    this.coerce = !!enabled;
    return this;
};

/**
 * 
 * @param {string} state
 * @return {lewd.Condition}
 */
Condition.prototype.setPropertyState = function (state) {
    this.state = state;
    return this;
};

/**
 * 
 * @return {Object}
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

