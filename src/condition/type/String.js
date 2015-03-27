'use strict';

var util = require('util');

var Condition = require('../Condition'),
    errorMessage = require('../../messages').Type;

/**
 * @class lewd.condition.type.String
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function StringTypeCondition() {
    Condition.call(this, 'StringType');

    this.supportsCoercion = true;
}

util.inherits(StringTypeCondition, Condition);

/**
 * @inheritdoc
 */
StringTypeCondition.prototype.validate = function (value, path) {
    if (typeof value === 'string') {
        return value;
    }

    if (this._coerce) {
        return value + '';
    }

    this.reject(value, path, errorMessage, { type: 'string' });
};

module.exports = StringTypeCondition;
