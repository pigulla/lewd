var util = require('util');

var BaseCondition = require('../Base'),
    errorMessages = require('../../messages');

function AnyCondition() {
    BaseCondition.call(this, 'Any');
}

util.inherits(AnyCondition, BaseCondition);

AnyCondition.prototype.validate = function (value, path) {
    return value;
};

module.exports = AnyCondition;
