var util = require('util');

var Condition = require('../Condition'),
    errorMessages = require('../../messages');

function AnyCondition() {
    Condition.call(this, 'Any');
}

util.inherits(AnyCondition, Condition);

AnyCondition.prototype.validate = function (value, path) {
    return value;
};

module.exports = AnyCondition;
