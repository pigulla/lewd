var _ = require('lodash');
var util = require('util');

function ConditionViolationException(value, path, template, data) {
    var smartFormat = require('../utils').smartFormat;

    Error.call(this);
    
    this.name = 'ConditionViolationException';
    this.path = path || [];
    this.pathStr = this.path.length === 0 ? '.' : this.path.join('.');
    this.data = data || {};
    this.value = value;
    this.valueStr = smartFormat(this.value);
    
    this.message = _.template(template, this.getTemplateVariables());
}

util.inherits(ConditionViolationException, Error);

ConditionViolationException.prototype.getTemplateVariables = function () {

    return _.assign({}, this.data, {
        originalMessage: this.message
    }, {
        path: this.path,
        pathStr: this.pathStr,
        value: this.value,
        valueStr: this.valueStr
    });
};

module.exports = ConditionViolationException;
