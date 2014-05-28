var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.len;

buster.testCase('"len" condition', {
    'minimum': function () {
        var args = [{ min: 1 }];

        refuteValues(condition, args, ['', []]);
        acceptValues(condition, args, ['42', 'hello', [42], [true], [[]]]);
    },
    'maximum': function () {
        var args = [{ max: 5 }];

        refuteValues(condition, args, ['hello world', [1, 2, 3, 4, 5, 6]]);
        acceptValues(condition, args, ['hello', [1, 2, 3]]);
    },
    'minimum exclusive': function () {
        var args = [{ min: 0, minInclusive: false }];

        refuteValues(condition, args, ['', []]);
        acceptValues(condition, args, ['x', 'whatever', ['say', 'what'], [42], [[]]]);
    },
    'maximum exclusive': function () {
        var args = [{ max: 5, maxInclusive: false }];

        refuteValues(condition, args, ['way too long', '12345', ['a', 'b', 'c', 'd', 'e']]);
        acceptValues(condition, args, ['1234', 'x', '', [], [1, 2], [[]]]);
    },
    'all options': function () {
        var args = [{
            min: 2,
            max: 5,
            minInclusive: false,
            maxInclusive: true
        }];

        refuteValues(condition, args, ['', 'x', '12', 'too long', [], [true], [[]], ['hey', 'there']]);
        acceptValues(condition, args, ['abc', 'abcde', [[], true, 42]]);
    },
    'error message': {
        'type': function () {
            assertViolationWithMessage(function () {
                condition({ max: 3 })(42);
            }, _.template(errorMessages.Len.type, {}));
        },
        'minimumExclusive': function () {
            var opts = { min: 5, minInclusive: false };
            assertViolationWithMessage(function () {
                condition(opts)('1234');
            }, _.template(errorMessages.Len.min, opts));
        },
        'maximumExclusive': function () {
            var opts = { max: 3, maxInclusive: false };
            assertViolationWithMessage(function () {
                condition(opts)('1234');
            }, _.template(errorMessages.Len.max, opts));
        },
        'minimumInclusive': function () {
            var opts = { min: 5, minInclusive: true };
            assertViolationWithMessage(function () {
                condition(opts)('1234');
            }, _.template(errorMessages.Len.minInclusive, opts));
        },
        'maximumInclusive': function () {
            var opts = { max: 3, maxInclusive: true };
            assertViolationWithMessage(function () {
                condition(opts)('1234');
            }, _.template(errorMessages.Len.maxInclusive, opts));
        }
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [true]);
        refuteSchemaOptions(condition, [{ min: '42', max: 13 }]);
        refuteSchemaOptions(condition, [{ min: 42, max: '13' }]);
        refuteSchemaOptions(condition, [{ minInclusive: 0 }]);
        refuteSchemaOptions(condition, [{ maxInclusive: 0 }]);
        refuteSchemaOptions(condition, [{ unknownKey: 'w00t' }]);
    }
});
