var util = require('util');

function UnexpectedParameterException(message) {
    Error.call(this);
    this.name = 'UnexpectedParameterException';
    this.message = message;
}

util.inherits(UnexpectedParameterException, Error);

module.exports = UnexpectedParameterException;
