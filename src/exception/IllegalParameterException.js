'use strict';

var util = require('util');

/**
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
