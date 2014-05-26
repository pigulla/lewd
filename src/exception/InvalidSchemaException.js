var util = require('util');

function InvalidSchemaException(reason) {
    Error.call(this);
    this.name = 'InvalidSchemaException';
    this.message = util.format('Schema is invalid: %s', reason);
}

util.inherits(InvalidSchemaException, Error);

module.exports = InvalidSchemaException;
