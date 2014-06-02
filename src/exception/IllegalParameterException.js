var util = require('util');

/**
 * @since 0.1.0
 * @class lewd.exception.IllegalParameterException
 * @extends Error
 * @param {string} message
 */
function IllegalParameterException(message) {
    Error.call(this);
    
    this.name = 'IllegalParameterException';
    this.message = message;
}

util.inherits(IllegalParameterException, Error);

module.exports = IllegalParameterException;
