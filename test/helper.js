var util = require('util');

var buster = require('buster');

var lewd = require('../src/lewd');

var assert = buster.referee.assert,
    refute = buster.referee.refute;

/*jshint maxparams: 5*/
function test(condition, args, accept, values, expected) {
    values.forEach(function (value, index) {
        var result;
        
        if (accept) {
            refute.exception(function () {
                result = condition.apply(lewd, args)(value);
            }, null, util.format('Value %s not expected to fail for arguments %s', value, args));
            
            assert.same(result, expected[index]);
        } else {
            assert.exception(function () {
                condition.apply(lewd, args)(value);
            }, 'ConditionViolationException');
        }
    });
}

module.exports = {
    acceptValues: function (condition, args, values, returned) {
        test(condition, args, true, values, arguments.length > 3 ? returned : values);
    },
    refuteValues: function (condition, args, values) {
        test(condition, args, false, values);
    },
    refuteSchemaOptions: function (condition, args) {
        assert.exception(function () {
            condition.apply(lewd, args);
        }, 'IllegalParameterException');
    },
    assertViolationWithMessage: function (fn, message) {
        try {
            fn();
        } catch (e) {
            assert.equals(e.name, 'ConditionViolationException');
            assert.equals(e.message, message);
            return;
        }

        assert(false, 'An exception should have been thrown');
    },
    assertViolationAt: function (fn, path) {
        try {
            fn();
        } catch (e) {
            assert.equals(e.name, 'ConditionViolationException');
            assert.equals(e.path, path);
            return;
        }
    
        assert(false, 'Condition should have failed');
    }
};
