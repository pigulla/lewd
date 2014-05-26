var someCondition = require('./Some'),
    ConditionViolationException = require('../exception/ConditionViolationException'),
    InvalidSchemaException = require('../exception/InvalidSchemaException');

module.exports = function (spec) {
    var utils = require('../utils');
    
    if (!Array.isArray(spec)) {
        throw new InvalidSchemaException('Parameter must be an array');
    }
    
    return function arrayCondition(values, path) {
        path = path || [];
        
        if (!Array.isArray(values)) {
            throw new ConditionViolationException(values, path, 'not an array');
        }
        
        if (spec.length === 0) {
            return;
        }

        var condition = someCondition(spec.map(utils.wrap));

        values.forEach(function (value, index) {
            condition(value, path.concat('#' + index));
        });
    };
};
