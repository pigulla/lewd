'use strict';

var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var assert = buster.referee.assert,
    refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertExceptionWithName = helper.assertExceptionWithName,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.none;

buster.testCase('"none" condition', {
    'no condition': function () {
        var args = [];

        acceptValues(condition, args, [0, -17.3, false, 'foo', null, [], {}, ['foo']]);
    },
    'one condition': function () {
        var args = [String];

        refuteValues(condition, args, ['', 'foo']);
        acceptValues(condition, args, [0, -17.3, null, [], {}, ['hey'], false]);
    },
    'multiple conditions': function () {
        var args = [String, lewd.regex(/^\d+/), lewd.regex(/\.\d{2}$/)];

        refuteValues(condition, args, [0, -17.13, 'foo', 42.1234]);
        acceptValues(condition, args, [false, null, [], {}, ['foo'], -7.5]);
    },
    'passes exceptions through': function () {
        assertExceptionWithName(function () {
            /* eslint-disable block-scoped-var, no-undef */
            condition(function () { x(); }).because('oh noes')('x');
            /* eslint-enable block-scoped-var, no-undef */
        }, 'ReferenceError');
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition(Number)(42);
        }, _.template(errorMessages.None)({}));
    }
});
