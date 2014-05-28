var util = require('util');

/**
 * @since 0.1.0
 * @extends Error
 * @param {string} message
 */
function WrongParameterException(message) {
    Error.call(this);
    
    this.name = 'WrongParameterException';
    this.message = message;
}

util.inherits(WrongParameterException, Error);

module.exports = WrongParameterException;
