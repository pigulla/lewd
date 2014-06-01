var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages'),
    InvalidSchemaException = require('../../exception/InvalidSchemaException'),
    utils = require('../../utils');

function LiteralCondition (literal) {
    Condition.call(this, 'Literal');

    if (!utils.isLiteral(literal)) {
        throw new InvalidSchemaException('Value must be a literal');
    }
    
    this.literal = literal;
}

util.inherits(LiteralCondition, Condition);

LiteralCondition.prototype.validate = function (value, path) {
    if (this.literal === value) {
        return value;
    }

    this.reject(value, path, errorMessages.Literal, {
        literal: this.literal,
        literalStr: utils.smartFormat(this.literal)
    });
};

module.exports = LiteralCondition;
