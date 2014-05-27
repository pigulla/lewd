var ConditionViolationException = require('../exception/ConditionViolationException');

module.exports = function (condition) {
    var utils = require('../utils'),
        message = require('../messages').Not;
    
    condition = utils.wrap(condition);
    
    return utils.customMessageWrapper(function notCondition(value, path) {
        try {
            condition(value, path);
        } catch (e) {
            return;
        }
    
        throw new ConditionViolationException(value, path, message);
    });
};
