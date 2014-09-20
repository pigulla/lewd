var _ = require('lodash');

var utils = require('../utils');

/**
 * @param {lewd.condition.Condition} condition
 * @return {lewd.condition.ConsumerWrapper}
 */
module.exports = function (condition) {
    var Condition = require('./Condition');

    /**
     * @class lewd.condition.ConsumerWrapper
     * @param {*} value
     * @param {Array.<(string|number)>=} path
     * @return {*}
     */
    function consumerWrapper(value, path) {
        return condition.validate(value, path || []);
    }

    _.assign(consumerWrapper, {
        wrapped: condition.type,
        because: function (reason) {
            utils.assertParameterCount(arguments, 0, 1);
            condition.setCustomMessage(reason);
            return consumerWrapper;
        },
        get: function (name) {
            utils.assertParameterCount(arguments, 1);
            var result = consumerWrapper.find(name);
            return result.length ? result[0] : null;
        },
        find: function (name) {
            utils.assertParameterCount(arguments, 1);
            return _.unique(condition.find(name));
        },
        as: function (name) {
            utils.assertParameterCount(arguments, 1);
            condition.name = name;
            return consumerWrapper;
        },
        default: function (value) {
            utils.assertParameterCount(arguments, 1);
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            condition.setDefaultValue(value);
            return consumerWrapper;
        },
        getDefault: function () {
            utils.assertParameterCount(arguments, 0);
            return condition.default;
        },
        coerce: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setCoercionEnabled(true);
            return consumerWrapper;
        },
        optional: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            return consumerWrapper;
        },
        forbidden: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.FORBIDDEN);
            return consumerWrapper;
        },
        required: function () {
            utils.assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.REQUIRED);
            return consumerWrapper;
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
    
    if (condition.type === 'Object') {
        _.assign(consumerWrapper, {
            allOptional: function () {
                condition.allOptional();
                return consumerWrapper;
            },
            allRequired: function () {
                condition.allRequired();
                return consumerWrapper;
            }
        });
    }

    return consumerWrapper;
};
