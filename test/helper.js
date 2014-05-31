var util = require('util');

var buster = require('buster');

var lewd = require('../src/lewd');

function test(condition, args, accept, values) {
    values.forEach(function (value) {
        if (accept) {
            var result;
            
            buster.referee.refute.exception(function () {
                result = condition.apply(lewd, args)(value);
            }, null, util.format('Value %s not expected to fail for arguments %s', value, args));
            
            buster.referee.assert.same(value, result);
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
    },
    assertViolationWithMessage: function (fn, message) {
        try {
            fn();
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.equals(e.message, message);
            return;
        }

        buster.referee.assert(false, 'An exception should have been thrown');
    },
    assertViolationAt: function (fn, path) {
        try {
            fn();
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.equals(e.path, path);
            return;
        }
    
        buster.referee.assert(false, 'Condition should have failed');
    }
};
