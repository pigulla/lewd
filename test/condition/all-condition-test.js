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

var condition = lewd.all;

buster.testCase('"all" condition', {
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
        var args = [String, lewd.regex(/^\d+/), lewd.regex(/\d+$/)];

        refuteValues(condition, args, [0, 42, null, [], {}, ['hey'], false, 'w00t', '0815!']);
        acceptValues(condition, args, ['1', '0815', '12polizei34']);
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
            condition(String, Number)('foo');
        }, _.template(errorMessages.Type)({ type: 'number' }));
    }
});
