var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.range;

buster.testCase('"range" condition', {
    'minimum': function () {
        var args = [{ min: 0 }];
        
        refuteValues(condition, args, [-1]);
        acceptValues(condition, args, [1, 0]);
    },
    'maximum': function () {
        var args = [{ max: 50 }];
        
        refuteValues(condition, args, [100]);
        acceptValues(condition, args, [30, 50]);
    },
    'minimum exclusive': function () {
        var args = [{ min: 0, minInclusive: false }];
        
        refuteValues(condition, args, [0]);
        acceptValues(condition, args, [0.001]);
    },
    'maximum exclusive': function () {
        var args = [{ max: 50, maxInclusive: false }];

        refuteValues(condition, args, [50]);
        acceptValues(condition, args, [49]);
    },
    'all args': function () {
        var args = [{
            min: 13,
            max: 99,
            minInclusive: false,
            maxInclusive: true
        }];

        refuteValues(condition, args, [-5, 13, 100]);
        acceptValues(condition, args, [13.1, 49, 99]);
    },
    'error message': {
        'minimumExclusive': function () {
            var opts = { min: 5, minInclusive: false };
            assertViolationWithMessage(function () {
                condition(opts)(4);
            }, _.template(errorMessages.Range.min, opts));
        },
        'maximumExclusive': function () {
            var opts = { max: 3, maxInclusive: false };
            assertViolationWithMessage(function () {
                condition(opts)(4);
            }, _.template(errorMessages.Range.max, opts));
        },
        'minimumInclusive': function () {
            var opts = { min: 5, minInclusive: true };
            assertViolationWithMessage(function () {
                condition(opts)(4);
            }, _.template(errorMessages.Range.minInclusive, opts));
        },
        'maximumInclusive': function () {
            var opts = { max: 3, maxInclusive: true };
            assertViolationWithMessage(function () {
                condition(opts)(4);
            }, _.template(errorMessages.Range.maxInclusive, opts));
        }
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [true]);
        refuteSchemaOptions(condition, [{ min: 42, max: '13' }]);
        refuteSchemaOptions(condition, [{ min: '42', max: 13 }]);
        refuteSchemaOptions(condition, [{ minInclusive: 0 }]);
        refuteSchemaOptions(condition, [{ maxInclusive: 0 }]);
        refuteSchemaOptions(condition, [{ unknownKey: 'w00t' }]);
    }
});
