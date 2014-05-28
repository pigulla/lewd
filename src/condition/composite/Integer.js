/**
 * @since 0.1.0
 * @param {Array} conditions
 * @return {function(*, Array.<string>)}
 */
module.exports = function () {
    var lewd = require('../../lewd'),
        message = require('../../messages').Integer;
    
    return lewd.all(Number, /^-?\d+$/).because(message);
};
