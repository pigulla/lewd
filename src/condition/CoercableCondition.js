var util = require('util');

var Condition = require('./Condition'),
    ConditionViolationException = require('../exception/ConditionViolationException');

/**
 * Base class for all conditions that support coercion.
 * 
 * If your condition supports coercion you *must* extend this class, even if you chose not to use the provided
 * functionality (e.g., by providing your own `validate` method and bypassing this class' implementation).
 * 
 * @class lewd.condition.CoercableCondition
 * @extends {lewd.condition.Condition}
 * @constructor
 * @param {string} name
 * @param {lewd.condition.ConsumerCondition=} strictCondition
 * @param {lewd.condition.ConsumerCondition=} coercableCondition
 */
function CoercableCondition(name, strictCondition, coercableCondition) {
    Condition.call(this, name);

    this.strictCondition = strictCondition;
    this.coercableCondition = coercableCondition || strictCondition;
}

util.inherits(CoercableCondition, Condition);

/* istanbul ignore next */
/**
 * Perform the actual coercion.
 * 
 * @abstract
 * @protected
 * @param {*} value
 * @param {Array.<string>} path
 * @return {*}
 */
CoercableCondition.prototype._coerce = function (value) {
    throw new Error('Condition must overwrite its validate() method');
};

/**
 * @inheritdoc
 */
CoercableCondition.prototype.validate = function (value, path, errorMessage) {
    if (this.coerce) {
        try {
            this.coercableCondition(value, path);
            return this._coerce(value);
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                this.reject(value, path, errorMessage);
            } else {
                throw e;
            }
        }
    } else {
        try {
            return this.strictCondition(value, path);
        } catch (e) {
            if (e instanceof ConditionViolationException) {
                this.reject(value, path, errorMessage);
            } else {
                throw e;
            }
        }
    }
};

module.exports = CoercableCondition;
