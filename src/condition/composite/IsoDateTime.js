var ConditionViolationException = require('../../exception/ConditionViolationException'),
    allCondition = require('../All');

function parsableCondition(value, path) {
    if (isNaN(Date.parse(value))) {
        throw new ConditionViolationException(value, path, 'not a valid ISO datetime string');
    }
}

module.exports = function () {
    // TODO: add options like before/after/future/past/...
    
    return allCondition([String, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, parsableCondition]);
};
