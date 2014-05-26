var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

var condition = lewd.integer;

buster.testCase('"integer" condition', {
    'simple': function () {
        var args = [];

        refuteValues(condition, args, [
            '', '42', true, [], null, {}, 'bcd', '1a', 'A', 14.3, -0.001
        ]);
        acceptValues(condition, args, [
            -1, 99, 123456, 0, 42, -199, 17.0
        ]);
    }
});
