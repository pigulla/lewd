var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

var condition = lewd.none;

buster.testCase('"none" condition', {
    'no condition': function () {
        var args = [];

        acceptValues(condition, args, [0, -17.3, false, 'foo', null, [], {}, ['blub']]);
    },
    'one condition': function () {
        var args = [String];

        refuteValues(condition, args, ['', 'blub']);
        acceptValues(condition, args, [0, -17.3, null, [], {}, ['hey'], false]);
    },
    'multiple conditions': function () {
        var args = [String, lewd.regex(/^\d+/), lewd.regex(/\.\d{2}$/)];

        refuteValues(condition, args, [0, -17.13, 'foo', 42.1234]);
        acceptValues(condition, args, [false, null, [], {}, ['blub'], -7.5]);
    }
});
