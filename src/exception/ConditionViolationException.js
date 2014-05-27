var _ = require('lodash');
var util = require('util');

function ConditionViolationException(value, path, template, data) {
    Error.call(this);
    
    this.name = 'ConditionViolationException';
    this.path = path || [];
    this.data = data || {};
    this.value = value;
    
    this.message = _.template(template, this.getTemplateVariables());
}

util.inherits(ConditionViolationException, Error);

ConditionViolationException.prototype.getTemplateVariables = function () {
    var smartFormat = require('../utils').smartFormat;

    return _.assign({}, this.data, {
        originalMessage: this.message,
        path: this.path,
        pathStr: this.path.length === 0 ? '.' : this.path.join('.'),
        value: this.value,
        valueStr: smartFormat(this.value)
    });
};

module.exports = ConditionViolationException;
