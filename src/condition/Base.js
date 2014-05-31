var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

var BaseCondition = function (name) {
    this.name = name;
    this.required = 'optional';
    this.coerce = false;
    this.customError = null;
    this.supportsCoercion = false;
};

BaseCondition.prototype.validate = function (value, path) {
    throw new Error('Condition must overwrite its validate() method');
};

BaseCondition.prototype.reject = function (value, path, messageTemplate, data) {
    throw new ConditionViolationException(
        value,
        path || [],
        this.customError ? this.customError : messageTemplate,
        data || {}
    );
};

BaseCondition.prototype.because = function (messageTemplate) {
    this.customError = messageTemplate;
};

BaseCondition.prototype.enableCoercion = function (enabled) {
    this.coerce = !!enabled;
};

BaseCondition.prototype.asPropertyRequired = function (required) {
    this.required = !!required;
};

BaseCondition.prototype.consumer = function (required) {
    return {
        because: this.because.bind(this),
        validate: this.validate.bind(this)    
    };
};

module.exports = BaseCondition;

