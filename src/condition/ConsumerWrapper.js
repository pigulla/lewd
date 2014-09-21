var _ = require('lodash');

var assertParameterCount = require('../utils').assertParameterCount;

var Condition = require('./Condition');

var MARKER_PROPERTY = '__lewd__invokable__';

/*
 * Implementation details:
 * 
 * The idea behind the construct below is to make a condition immediately callable while at the same time minimizing
 * the API surface exposed to the consumer (i.e., the user).
 * 
 * If we were to use a construct like "wrapper = new ConsumerWrapper(condition)" the user couldn't do "wrapper(42)".
 * This is why the "wrapInvokable" function creates a closure and has to proxy the methods provided by the
 * ConsumerWrapper class.
 */

/**
 * @class lewd.condition.ConsumerWrapper
 * @constructor
 * @param {lewd.condition.Condition} condition
 * @param {function} invokable
 */
function ConsumerWrapper(condition, invokable) {
    this.condition = condition;
    this.invokable = invokable;
}
 
/**
 * The condition being wrapped.
 * 
 * @type {lewd.condition.Condition}
 */
ConsumerWrapper.prototype.condition; // jshint ignore:line

/**
 * The invokable function created by wrapInvokable which most methods will need to return to allow for proper chaining.
 * 
 * @type {function}
 */
ConsumerWrapper.prototype.invokable; // jshint ignore:line

/**
 * @since 0.8.0
 * @static
 * @param {*} value
 * @return {boolean}
 */
ConsumerWrapper.isWrapper = function (value) {
    return typeof value === 'function' && value[MARKER_PROPERTY];
};

/**
 * @since 0.8.0
 * @static
 * @param {lewd.condition.Condition} condition
 * @return {function}
 */
ConsumerWrapper.wrapInvokable = function (condition) {
    function invokableWrapper(value, path) {
        return condition.validate(value, path || []);
    }
    invokableWrapper[MARKER_PROPERTY] = true;
    invokableWrapper.wrapped = condition.getType();

    var wrapper = new ConsumerWrapper(condition, invokableWrapper);

    Object.keys(ConsumerWrapper.prototype).forEach(function (property) {
        /* istanbul ignore else */
        if (typeof ConsumerWrapper.prototype[property] === 'function') {
            invokableWrapper[property] = wrapper[property].bind(wrapper);
        }
    });

    return invokableWrapper;
};

/**
 * @since 0.1.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.because = function (reason) {
    assertParameterCount(arguments, 0, 1);
    this.condition.setCustomMessage(reason);
    return this.invokable;
};

/**
 * @since 0.8.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.lock = function () {
    this.condition.lock();
    return this.invokable;
};

/**
 * @since 0.5.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.get = function (name) {
    assertParameterCount(arguments, 1);
    var result = this.find(name);
    return result.length ? result[0] : null;
};

/**
 * @since 0.5.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.find = function (name) {
    assertParameterCount(arguments, 1);
    return _.unique(this.condition.find(name));
};

/**
 * @since 0.5.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.as = function (name) {
    assertParameterCount(arguments, 1);
    this.condition.setName(name);
    return this.invokable;
};

/**
 * @since 0.3.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.default = function (value) {
    assertParameterCount(arguments, 1);
    this.condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
    this.condition.setDefaultValue(value);
    return this.invokable;
};

/**
 * @since 0.3.0
 * @return {*}
 */
ConsumerWrapper.prototype.getDefault = function () {
    assertParameterCount(arguments, 0);
    return this.condition.getDefaultValue();
};

/**
 * @since 0.3.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.coerce = function () {
    assertParameterCount(arguments, 0);
    this.condition.setCoercionEnabled(true);
    return this.invokable;
};

/**
 * @since 0.2.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.optional = function () {
    assertParameterCount(arguments, 0);
    this.condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
    return this.invokable;
};

/**
 * @since 0.7.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.allOptional = function () {
    assertParameterCount(arguments, 0);
    this.condition.allOptional();
    return this.invokable;
};

/**
 * @since 0.5.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.forbidden = function () {
    assertParameterCount(arguments, 0);
    this.condition.setPropertyState(Condition.PROPERTY_STATE.FORBIDDEN);
    return this.invokable;
};

/**
 * @since 0.2.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.required = function () {
    assertParameterCount(arguments, 0);
    this.condition.setPropertyState(Condition.PROPERTY_STATE.REQUIRED);
    return this.invokable;
};

/**
 * @since 0.7.0
 * @return {lewd.condition.ConsumerWrapper}
 */
ConsumerWrapper.prototype.allRequired = function () {
    assertParameterCount(arguments, 0);
    this.condition.allRequired();
    return this.invokable;
};

/**
 * @since 0.5.0
 * @return {boolean}
 */
ConsumerWrapper.prototype.isForbidden = function () {
    assertParameterCount(arguments, 0);
    return this.condition.getPropertyState() === Condition.PROPERTY_STATE.FORBIDDEN;
};

/**
 * @since 0.3.0
 * @returns {boolean}
 */
ConsumerWrapper.prototype.isOptional = function () {
    assertParameterCount(arguments, 0);
    return this.condition.getPropertyState() === Condition.PROPERTY_STATE.OPTIONAL;
};

/**
 * @since 0.3.0
 * @return {boolean}
 */
ConsumerWrapper.prototype.isRequired = function () {
    assertParameterCount(arguments, 0);
    return this.condition.getPropertyState() === Condition.PROPERTY_STATE.REQUIRED;
};

module.exports = {
    wrap: ConsumerWrapper.wrapInvokable,
    isWrapper: ConsumerWrapper.isWrapper
};
