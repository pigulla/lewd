var _ = require('lodash');

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
            condition.setCustomMessage(reason);
            return wrapper;
        },
        get: function (name) {
            var result = condition.wrapper.find(name);
            return result.length ? result[0] : null;
        },
        find: function (name) {
            return _.unique(condition.find(name));
        },
        as: function (name) {
            condition.name = name;
            return wrapper;
        },
        default: function (value) {
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            condition.setDefaultValue(value);
            return wrapper;
        },
        getDefault: function () {
            return condition.default;
        },
        coerce: function () {
            condition.setCoercionEnabled(true);
            return wrapper;
        },
        optional: function () {
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            return wrapper;
        },
        forbidden: function () {
            condition.setPropertyState(Condition.PROPERTY_STATE.FORBIDDEN);
            return wrapper;
        },
        required: function () {
            condition.setPropertyState(Condition.PROPERTY_STATE.REQUIRED);
            return wrapper;
        },
        isForbidden: function () {
            return condition.state === Condition.PROPERTY_STATE.FORBIDDEN;
        },
        isOptional: function () {
            return condition.state === Condition.PROPERTY_STATE.OPTIONAL;
        },
        isRequired: function () {
            return condition.state === Condition.PROPERTY_STATE.REQUIRED;
        }
    });

    return wrapper;
};
