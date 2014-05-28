var ConditionViolationException = require('../exception/ConditionViolationException');

/**
 * @since 0.1.0
 * @param {Array} conditions
 * @return {function(*, Array.<string>)}
 */
module.exports = function (conditions) {
    var lewd = require('../lewd'),
        utils = require('../utils'),
        message = require('../messages').None;

    conditions = conditions.map(lewd._wrap);
    
    return utils.customMessageWrapper(function noneCondition(value, path) {
        if (conditions.length === 0) {
            return;
        }

        if (!conditions.every(function (condition) {
            try {
                condition(value, path);
                return false;
            } catch (e) {
                return true;
            }
        })) {
            throw new ConditionViolationException(value, path, message);
        }
    });
};
