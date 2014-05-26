var utils = require('../utils');

module.exports = function (conditions) {
    conditions = conditions.map(utils.wrap);
    
    return function allCondition(value, path) {
        conditions.forEach(function (condition) {
            condition(value, path);
        });
    };
};
