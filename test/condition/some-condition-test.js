var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.some;

buster.testCase('"some" condition', {
    'no condition': function () {
        var args = [];

        acceptValues(condition, args, [0, false, 'foo', null, [], {}, ['foo']]);
    },
    'one condition': function () {
        var args = [String];

        refuteValues(condition, args, [0, null, [], {}, ['hey'], false]);
        acceptValues(condition, args, ['hello', '']);
    },
    'multiple conditions': function () {
        var args = [String, /^\d+/, /\.\d{2}$/];

        refuteValues(condition, args, [false, null, {}, [], -3.1415]);
        acceptValues(condition, args, ['1', '0815', 'awesomesauce', 42, -1.99]);
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition(Number, String, Boolean)(null);
        }, _.template(errorMessages.Some, {}));
    }
});
