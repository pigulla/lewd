var util = require('util');
var _ = require('lodash');

/**
 * @since 0.1.0
 * @extends Error
 * @param {*} value 
 * @param {Array.<string>} path 
 * @param {string} template 
 * @param {Object=} data
 * @throws InvalidSchemaException
 */
function ConditionViolationException(value, path, template, data) {
    var smartFormat = require('../utils').smartFormat;

    Error.call(this);
    
    this.name = 'ConditionViolationException';
    this.path = path;
    this.pathStr = this.path.length === 0 ? '.' : this.path.join('.');
    this.data = data || {};
    this.value = value;
    this.valueStr = smartFormat(this.value);
    
    this.message = _.template(template, this.getTemplateVariables());
}

util.inherits(ConditionViolationException, Error);

ConditionViolationException.prototype.getTemplateVariables = function () {
    return _.assign({}, this.data, {
        path: this.path,
        pathStr: this.pathStr,
        value: this.value,
        valueStr: this.valueStr
    });
};

module.exports = ConditionViolationException;
