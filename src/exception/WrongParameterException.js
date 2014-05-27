var util = require('util');

function WrongParameterException(message) {
    Error.call(this);
    this.name = 'WrongParameterException';
    this.message = message;
}

util.inherits(WrongParameterException, Error);

module.exports = WrongParameterException;
