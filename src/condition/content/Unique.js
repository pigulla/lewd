var util = require('util');

var Condition = require('../Condition'),
    ConditionViolationException = require('../../exception/ConditionViolationException'),
    IllegalParameterException = require('../../exception/IllegalParameterException'),
    errorMessages = require('../../messages').Unique,
    utils = require('../../utils');

/**
 * Checks if all values in an array are unique, ignoring non-literals.
 *  
 * @param {Array} array
 * @return {*} Returns the first found duplicate or undefined if there are none.
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
            return array[i];
        }
        
        o[key] = true;
    }
    
    // Returned undefined if no duplicates are found. This works as a return value because it can not naturally occur
    // in a "JSON object".
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
    
    if (duplicate !== undefined) {
        this.reject(
            value, path,
            errorMessages.duplicateFound,
            { duplicate: duplicate, duplicateStr: utils.smartFormat(duplicate) }
        );
    }
    
    return value;
};

module.exports = UniqueCondition;
