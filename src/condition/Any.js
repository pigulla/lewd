/**
 * @since 0.1.0
 * @return {function(*, Array.<string>)}
 */
module.exports = function () {
    var utils = require('../utils');
    
    return utils.customMessageWrapper(function anyCondition(value, path) {
        return value;
    });
};
