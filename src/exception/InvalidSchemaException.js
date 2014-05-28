var util = require('util');

/**
 * @since 0.1.0
 * @extends Error
 * @param {String} reason
 */
function InvalidSchemaException(reason) {
    Error.call(this);
    
    this.name = 'InvalidSchemaException';
    this.message = util.format('Schema is invalid: %s', reason);
}

util.inherits(InvalidSchemaException, Error);

module.exports = InvalidSchemaException;
