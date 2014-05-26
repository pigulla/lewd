var allCondition = require('../All');

module.exports = function () {
    return allCondition([Number, /^-?\d+$/]);
};
