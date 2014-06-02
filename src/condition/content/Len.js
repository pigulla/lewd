var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Len;

function validateOptions(options) {
    if (typeof options !== 'object') {
        throw new IllegalParameterException('Options must be an object');
    }

    var defaults = {
            min: 0,
            max: Infinity,
            minInclusive: true,
            maxInclusive: true
        },
        opts = _.defaults({}, options, defaults),
        unknownOptions = _.difference(Object.keys(options), Object.keys(defaults));

    if (unknownOptions.length > 0) {
        throw new IllegalParameterException('Unknown option: "' + unknownOptions[0] + '"');
    }

    if (typeof opts.min !== 'number') {
        throw new IllegalParameterException('Option "min" must be a number');
    }
    if (typeof opts.max !== 'number') {
        throw new IllegalParameterException('Option "max" must be a number');
    }
    if (typeof opts.minInclusive !== 'boolean') {
        throw new IllegalParameterException('Option "minInclusive" must be a boolean');
    }
    if (typeof opts.maxInclusive !== 'boolean') {
        throw new IllegalParameterException('Option "maxInclusive" must be a boolean');
    }

    return opts;
}

/**
 * @class lewd.condition.content.Len
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function LenCondition (options) {
    Condition.call(this, 'Len');
    this.options = validateOptions(options);
}

util.inherits(LenCondition, Condition);

/**
 * @inheritdoc
 */
LenCondition.prototype.validate = function (value, path) {
    var key;

    if (typeof value !== 'string' && !Array.isArray(value)) {
        this.reject(value, path, errorMessages.type, this.options);
    }

    if (value.length > this.options.max || (value.length === this.options.max && !this.options.maxInclusive)) {
        key = 'max' + (this.options.maxInclusive ? 'Inclusive' : '');
        this.reject(value, path, errorMessages[key], this.options);
    }
    if (value.length < this.options.min || (value.length === this.options.min && !this.options.minInclusive)) {
        key = 'min' + (this.options.minInclusive ? 'Inclusive' : '');
        this.reject(value, path, errorMessages[key], this.options);
    }

    return value;
};

module.exports = LenCondition;
