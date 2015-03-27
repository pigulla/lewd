'use strict';

var util = require('util');

var validator = require('validator');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').MongoId;

/**
 * @class lewd.condition.validator.MongoId
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function MongoIdCondition() {
    Condition.call(this, 'MongoId');
}

util.inherits(MongoIdCondition, Condition);

/**
 * @inheritdoc
 */
MongoIdCondition.prototype.validate = function (value, path) {
    if (typeof value !== 'string') {
        this.reject(value, path, errorMessages.type);
    }

    if (!validator.isMongoId(value)) {
        this.reject(value, path, errorMessages.invalid);
    }

    return value;
};

module.exports = MongoIdCondition;
