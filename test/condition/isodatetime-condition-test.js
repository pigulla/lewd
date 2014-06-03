var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.isoDateTime;

buster.testCase('"isoDateTime" condition', {
    'simple': function () {
        var args = [];

        refuteValues(condition, args, [
            '', 42, true, [], null, 'bcd', '1a', 'A',
            '2014-13-22T07:15:26.692Z',
            '2014-13-22T07:15:26.692Z  ',
            '2014-01-22T25:15:26.692Z',
            '2014-01-22T25:15:26.692',
            'Aug 9, 1995',
        ]);
        acceptValues(condition, args, [
            '2014-05-22T07:15:26.692Z',
            '2014-02-01T00:15:26.000Z'
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

        buster.referee.assert(false, 'An exception should have been thrown');
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition()('foo');
        }, _.template(errorMessages.IsoDateTime, {}));
    }
});
