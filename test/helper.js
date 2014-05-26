var util = require('util');

var buster = require('buster');

var lewd = require('../src/lewd');

function test(condition, args, accept, values) {
    values.forEach(function (value) {
        if (accept) {
            buster.referee.refute.exception(function () {
                condition.apply(lewd, args)(value);
            }, null, util.format('Value %s not expected to fail for arguments %s', value, args));
        } else {
            buster.referee.assert.exception(function () {
                condition.apply(lewd, args)(value);
            }, 'ConditionViolationException');
        }
    });
}

module.exports = {
    acceptValues: function (condition, args, values) {
        test(condition, args, true, values);
    },
    
    refuteValues: function (condition, args, values) {
        test(condition, args, false, values);
    },
    
    refuteSchemaOptions: function (condition, args) {
        buster.referee.assert.exception(function () {
            condition.apply(lewd, args);
        }, 'InvalidSchemaException');
    }
};
