var ConditionViolationException = require('../exception/ConditionViolationException'),
    utils = require('../utils');

module.exports = function (conditions) {
    conditions = conditions.map(utils.wrap);
    
    return function noneCondition(value, path) {
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
            throw new ConditionViolationException(value, path, 'satisfied at least one condition');
        }
    };
};
