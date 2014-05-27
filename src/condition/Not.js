var ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (condition) {
    var lewd = require('../lewd'),
        utils = require('../utils'),
        message = require('../messages').Not;
    
    condition = lewd._wrap(condition);
    
    return utils.customMessageWrapper(function notCondition(value, path) {
        try {
            condition(value, path);
        } catch (e) {
            return;
        }
    
        throw new ConditionViolationException(value, path, message);
    });
};
