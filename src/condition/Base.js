var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

var BaseCondition = function (name) {
    this.name = name;
    this.required = null;
    this.coerce = false;
    this.customError = null;
    this.supportsCoercion = false;
};

BaseCondition.prototype.validate = function (value, path) {
    throw new Error('Condition must overwrite its validate() method');
};

BaseCondition.prototype.reject = function (value, path, messageTemplate, templateData) {
    var data = templateData || {};
    
    if (this.customError) {
        data.originalMessage = messageTemplate;
    }
    
    throw new ConditionViolationException(
        value,
        path || [],
        this.customError ? this.customError : messageTemplate,
        data
    );
};

BaseCondition.prototype.because = function (messageTemplate) {
    this.customError = messageTemplate;
    return this;
};

BaseCondition.prototype.enableCoercion = function (enabled) {
    this.coerce = !!enabled;
    return this;
};

BaseCondition.prototype.asPropertyRequired = function (required) {
    this.required = !!required;
    return this;
};

BaseCondition.prototype.consumer = function () {
    var self = this,
        wrapper = function consumerWrapper(value, path) {
            // do not use Function.bind() here because it will reset the function's name
            return self.validate.call(self, value, path || []);
        };
    
    _.assign(wrapper, {
        wrapped: this.name,
        because: function (reason) {
            self.because(reason);
            return wrapper;
        },
        coerce: function (enabled) {
            self.enableCoercion(arguments.length === 0 ? true : !!enabled);
            return wrapper;
        },
        optional: function () {
            self.asPropertyRequired(false);
            return wrapper;
        },
        required: function () {
            self.asPropertyRequired(true);
            return wrapper;
        },
        asProperty: function () {
            return self.required;
        }
    });
    
    return wrapper;
};

module.exports = BaseCondition;

