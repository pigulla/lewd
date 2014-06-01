var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.not;

buster.testCase('"not" condition', {
    'String': function () {
        var args = [String];

        refuteValues(condition, args, ['foo', 'X']);
        acceptValues(condition, args, [0, -17.3, false, null, [], {}, ['foo']]);
    },
    'null': function () {
        var args = [null];

        refuteValues(condition, args, [null]);
        acceptValues(condition, args, [0, -17.3, 'foo', 'X', false, [], {}, ['foo']]);
    },
    'passes exceptions through': function () {
        buster.referee.assert.exception(function () {
            condition(function () { x(); })(null);  // jshint ignore:line                
        }, 'ReferenceError');
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition(Number)(42);
        }, _.template(errorMessages.Not, {}));
    }
});
