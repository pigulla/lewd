module.exports = function (conditions) {
    var lewd = require('../lewd'),
        utils = require('../utils');
    
    conditions = conditions.map(lewd._wrap);
    
    return utils.customMessageWrapper(function allCondition(value, path) {
        conditions.forEach(function (condition) {
            condition(value, path);
        });
    });
};
