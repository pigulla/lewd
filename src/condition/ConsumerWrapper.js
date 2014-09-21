var _ = require('lodash');

var assertParameterCount = require('../utils').assertParameterCount;

var ConditionLockedException = require('../exception/ConditionLockedException');

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
        wrapped: condition.getType(),
        because: function (reason) {
            assertParameterCount(arguments, 0, 1);
            condition.setCustomMessage(reason);
            return consumerWrapper;
        },
        lock: function () {
            condition.lock();
            return consumerWrapper;
        },
        get: function (name) {
            assertParameterCount(arguments, 1);
            var result = consumerWrapper.find(name);
            return result.length ? result[0] : null;
        },
        find: function (name) {
            assertParameterCount(arguments, 1);
            return _.unique(condition.find(name));
        },
        as: function (name) {
            assertParameterCount(arguments, 1);
            condition.setName(name);
            return consumerWrapper;
        },
        default: function (value) {
            assertParameterCount(arguments, 1);
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            condition.setDefaultValue(value);
            return consumerWrapper;
        },
        getDefault: function () {
            assertParameterCount(arguments, 0);
            return condition.getDefaultValue();
        },
        coerce: function () {
            assertParameterCount(arguments, 0);
            condition.setCoercionEnabled(true);
            return consumerWrapper;
        },
        optional: function () {
            assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.OPTIONAL);
            return consumerWrapper;
        },
        forbidden: function () {
            assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.FORBIDDEN);
            return consumerWrapper;
        },
        required: function () {
            assertParameterCount(arguments, 0);
            condition.setPropertyState(Condition.PROPERTY_STATE.REQUIRED);
            return consumerWrapper;
        },
        isForbidden: function () {
            assertParameterCount(arguments, 0);
            return condition.getPropertyState() === Condition.PROPERTY_STATE.FORBIDDEN;
        },
        isOptional: function () {
            assertParameterCount(arguments, 0);
            return condition.getPropertyState() === Condition.PROPERTY_STATE.OPTIONAL;
        },
        isRequired: function () {
            assertParameterCount(arguments, 0);
            return condition.getPropertyState() === Condition.PROPERTY_STATE.REQUIRED;
        }
    });
    
    if (condition.getType() === 'Object') {
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
