var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Unique,
    utils = require('../../utils');

/**
 * Checks if all values in an array are unique, ignoring non-literals. Returns an object describing the first found
 * duplicate or false if there were none.
 *  
 * @param {Array} array
 * @return {(Object|boolean)}
 */
function checkUniqueness(array) {
    var o = Object.create(null),
        l = array.length,
        i, key;
    
    for (i = 0; i < l; i++) {
        if (!utils.isLiteral(array[i])) {
            continue;
        }
        
        key = (typeof array[i]) + ':' + array[i];
        
        if (o[key]) {
            return {
                index: i,
                value: array[i]
            };
        }
        
        o[key] = true;
    }
    
    return false;
}

/**
 * @class lewd.condition.content.UniqueCondition
 * @extends {lewd.condition.Condition}
 * @constructor
 */
function UniqueCondition() {
    Condition.call(this, 'Unique');
}

util.inherits(UniqueCondition, Condition);

/**
 * @inheritdoc
 */
UniqueCondition.prototype.validate = function (value, path) {
    if (!Array.isArray(value)) {
        this.reject(value, path, errorMessages.type);
    }
    
    var duplicate = checkUniqueness(value);
    
    if (duplicate) {
        this.reject(
            value, path.concat('#' + duplicate.index), errorMessages.duplicateFound, {
                duplicate: duplicate.value,
                duplicateStr: utils.smartFormat(duplicate.value)
            }
        );
    }
    
    return value;
};

module.exports = UniqueCondition;
