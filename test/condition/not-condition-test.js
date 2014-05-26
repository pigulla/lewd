var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

var condition = lewd.not;

buster.testCase('"not" condition', {
    'String': function () {
        var args = [String];

        refuteValues(condition, args, ['foo', 'X']);
        acceptValues(condition, args, [0, -17.3, false, null, [], {}, ['blub']]);
    },
    'null': function () {
        var args = [null];

        refuteValues(condition, args, [null]);
        acceptValues(condition, args, [0, -17.3, 'foo', 'X', false, [], {}, ['blub']]);
    }
});
