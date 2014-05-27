var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

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
    },
    'with custom message': function () {
        try {
            condition().because('i say so')('42');
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.equals(e.message, 'i say so');
            return;
        }

        buster.referee.assert(false, 'An exception should should have been thrown');
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition()('foo');
        }, _.template(errorMessages.Integer, {}));
    }
});
