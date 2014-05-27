var ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (conditions) {
    var utils = require('../utils'),
        message = require('../messages').None;

    conditions = conditions.map(utils.wrap);
    
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
