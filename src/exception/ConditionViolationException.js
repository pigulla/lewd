var _ = require('lodash');
var util = require('util');

function ConditionViolationException(value, path, template, data) {
    var smartFormat = require('../utils').smartFormat;
    
    Error.call(this);
    
    this.name = 'ConditionViolationException';
    this.path = path || [];
    this.data = data || {};
    this.value = value;
    this.valueStr = smartFormat(value);
    
    this.message = _.template(template, _.assign({}, this.data, {
        path: this.path,
        value: this.value,
        valueStr: this.valueStr
    }));
}

util.inherits(ConditionViolationException, Error);

module.exports = ConditionViolationException;
