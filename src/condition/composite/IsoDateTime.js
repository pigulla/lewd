module.exports = function () {
    var lewd = require('../../lewd'),
        ConditionViolationException = require('../../exception/ConditionViolationException'),
        message = require('../../messages').IsoDateTime;

    function parsableCondition(value, path) {
        if (isNaN(Date.parse(value))) {
            throw new ConditionViolationException(value, path);
        }
    }
    
    return lewd.all(
        String, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, parsableCondition
    ).because(message);
};
