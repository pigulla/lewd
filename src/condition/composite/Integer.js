module.exports = function () {
    var lewd = require('../../lewd'),
        message = require('../../messages').Integer;
    
    return lewd.all(Number, /^-?\d+$/).because(message);
};
