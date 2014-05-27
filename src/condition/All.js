module.exports = function (conditions) {
    var utils = require('../utils');
    
    conditions = conditions.map(utils.wrap);
    
    return utils.customMessageWrapper(function allCondition(value, path) {
        conditions.forEach(function (condition) {
            condition(value, path);
        });
    });
};
