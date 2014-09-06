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
    
    this._literal = literal;
}

util.inherits(LiteralCondition, Condition);

/* jshint -W030 */
/**
 * @private
 * @type {(String|Number|Boolean|null))}
 */
LiteralCondition.prototype._literal;
/* jshint +W030 */

/**
 * @inheritdoc
 */
LiteralCondition.prototype.validate = function (value, path) {
    if (this._literal === value) {
        return value;
    }

    this.reject(value, path, errorMessages.Literal, {
        literal: this._literal,
        literalStr: utils.smartFormat(this._literal)
    });
};

module.exports = LiteralCondition;
