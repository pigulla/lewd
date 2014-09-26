var util = require('util');

var _ = require('lodash'),
    pointer = require('json-pointer');

/**
 * @class lewd.exception.ConditionViolationException
 * @extends Error
 * @param {*} value 
 * @param {Array.<(string|number)>} path 
 * @param {string} template 
 * @param {Object=} data
 */
function ConditionViolationException(value, path, template, data) {
    var smartFormat = require('../utils').smartFormat;

    Error.call(this);
    
    this.name = 'ConditionViolationException';
    this.path = path;
    this.pathStr = pointer.compile(path);
    this.data = data || {};
    this.value = value;
    this.valueStr = smartFormat(this.value);
    
    this.message = _.template(template, this._getTemplateVariables());
}

util.inherits(ConditionViolationException, Error);

/**
 * Returns the template variables hash for constructing the actual error message.
 * 
 * @return {Object.<string, *>}
 */
ConditionViolationException.prototype._getTemplateVariables = function () {
    return _.assign({}, this.data, {
        path: this.path,
        pathStr: this.pathStr,
        value: this.value,
        valueStr: this.valueStr
    });
};

/**
 * @inheritdoc
 */
ConditionViolationException.prototype.toString = function () {
    return util.format('Condition violation at "%s": %s', this.pathStr, this.message);
};

module.exports = ConditionViolationException;
