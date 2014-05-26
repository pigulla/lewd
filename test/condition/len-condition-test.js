var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

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
    }
});
