var ConditionViolationException = require('../exception/ConditionViolationException'),
    utils = require('../utils');

module.exports = function (condition) {
    condition = utils.wrap(condition);
    
    return function notCondition(value, path) {
        try {
            condition(value, path);
        } catch (e) {
            return;
        }
    
        throw new ConditionViolationException(value, path, 'satisfied the negated condition');
    };
};
