var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.passwordStrength;

buster.testCase('"passwordStrength" condition', {
    'simple': function () {
        var args = [];

        refuteValues(condition, args, ['', 42, true, [], null, 'bcd', '1a', 'A']);
        acceptValues(condition, args, ['a1!B2"c3§d3§']);
    }
});
