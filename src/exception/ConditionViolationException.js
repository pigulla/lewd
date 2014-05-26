var util = require('util');

function ConditionViolationException(value, path, reason) {
    Error.call(this);
    this.name = 'ConditionViolationException';
    this.path = path || [];
    this.message = util.format(
        'Value <%s>%s at %s is invalid: %s',
        typeof value, value, this.path.length ? this.path.join('.') : 'top level', reason
    );
}

util.inherits(ConditionViolationException, Error);

module.exports = ConditionViolationException;
