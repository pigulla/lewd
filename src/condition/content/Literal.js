var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    utils = require('../../utils');

/**
 * @class lewd.condition.content.Literal
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {(string|number|boolean|null)} literal
 */
function LiteralCondition(literal) {
    Condition.call(this, 'Literal');

    if (!utils.isLiteral(literal)) {
        throw new IllegalParameterException('Value must be a literal');
    }
    
    this.literal = literal;
}

util.inherits(LiteralCondition, Condition);

/**
 * @inheritdoc
 */
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
