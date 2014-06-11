var _ = require('lodash');

var utils = require('../utils');

/**
 * @param {lewd.condition.Condition} condition
 * @return {lewd.condition.ConsumerWrapper}
 */
module.exports = function (condition) {
    var Condition = require('./Condition'),
        wrapper = function consumerWrapper(value, path) {
            // do not use Function.bind() here because it will reset the function's name
            return condition.validate(value, path || []);
        };

    _.assign(wrapper, {
        wrapped: condition.type,
        because: function (reason) {
            utils.assertParameterCount(arguments, 0, 1);
            condition.setCustomMessage(reason);
            return wrapper;
        },
        get: function (name) {
            utils.assertParameterCount(arguments, 1);
            var result = condition.wrapper.find(name);
            return result.length ? result[0] : null;
        },
        find: function (name) {
            utils.assertParameterCount(arguments, 1);
            return _.unique(condition.find(name));
        },
        as: function (name) {
            utils.assertParameterCount(arguments, 1);
            condition.name = name;
            return wrapper;
        },
        default: function (value) {
            utils.assertParameterCount(arguments, 1);
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            condition.setDefaultValue(value);
            return wrapper;
        },
        getDefault: function () {
            utils.assertParameterCount(arguments, 0);
            return condition.default;
        },
        coerce: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setCoercionEnabled(true);
            return wrapper;
        },
        optional: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            return wrapper;
        },
        forbidden: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.FORBIDDEN);
            return wrapper;
        },
        required: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.REQUIRED);
            return wrapper;
        },
        isForbidden: function () {
            utils.assertParameterCount(arguments, 0);
            return condition.state === Condition.PROPERTY_STATE.FORBIDDEN;
        },
        isOptional: function () {
            utils.assertParameterCount(arguments, 0);
            return condition.state === Condition.PROPERTY_STATE.OPTIONAL;
        },
        isRequired: function () {
            utils.assertParameterCount(arguments, 0);
            return condition.state === Condition.PROPERTY_STATE.REQUIRED;
        }
    });

    return wrapper;
};
