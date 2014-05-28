var ConditionViolationException = require('../exception/ConditionViolationException');

/**
 * @since 0.1.0
 * @param {*} condition
 * @return {function(*, Array.<string>)}
 */
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
