var _ = require('lodash');

var ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

module.exports = {
    name: null,              // should be overwritten
    asProperty: 'optional',  // set by lewd.optional() and lewd.required()
    coerce: false,           // set by lewd.coerce()
    customError: null,       // should be overwritten
    supportsCoercion: false, 
    
    value: null,  // set when evaluated
    path: null,   // set when evaluated
    
    reject: function (messageTemplate, data) {
        throw new ConditionViolationException(
            this.value,
            this.path,
            this.customError ? this.customError : messageTemplate,
            data || {}
        );
    },
    
    because: function (messageTemplate) {
        this.customError = messageTemplate;
    },
    
    invoke: function (value) {
        throw new Error('Condition must overwrite its invoke() method');
    }
};
