'use strict';

var util = require('util');

/**
 * @class lewd.exception.ConditionLockedException
 * @extends Error
 */
function ConditionLockedException() {
    Error.call(this);

    this.name = 'ConditionLockedException';
    this.message = 'The condition is locked.';
}

util.inherits(ConditionLockedException, Error);

module.exports = ConditionLockedException;
