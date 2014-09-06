var util = require('util');

var _ = require('lodash');

var Condition = require('../Condition'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages');

function validateOptions(options) {
    if (options === null || typeof options !== 'object') {
        throw new IllegalParameterException('Options must be an object');
    }

    var defaults = {
            min: -Infinity,
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
 * @class lewd.condition.content.Range
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function RangeCondition(options) {
    Condition.call(this, 'Range');
    
    this.options = validateOptions(options);
}

util.inherits(RangeCondition, Condition);

/**
 * @inheritdoc
 */
RangeCondition.prototype.validate = function (value, path) {
    var key;

    if (value > this.options.max || (value === this.options.max && !this.options.maxInclusive)) {
        key = 'max' + (this.options.maxInclusive ? 'Inclusive' : '');
        this.reject(value, path, errorMessages.Range[key], this.options);
    }
    if (value < this.options.min || (value === this.options.min && !this.options.minInclusive)) {
        key = 'min' + (this.options.minInclusive ? 'Inclusive' : '');
        this.reject(value, path, errorMessages.Range[key], this.options);
    }

    return value;
};

module.exports = RangeCondition;
