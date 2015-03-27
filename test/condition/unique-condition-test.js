'use strict';

var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    utils = require('../../src/utils'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.unique;

buster.testCase('"unique" condition', {
    'minimum': function () {
        var args = [];

        refuteValues(condition, args, [
            42,
            null,
            {},
            '',
            [1, 1],
            [0, 1, 2, 3, 4, 1],
            ['foo', 1, 'bar', 'bar']
        ]);
        acceptValues(condition, args, [
            [],
            [0, 1],
            ['1', 1, true, {}],
            ['foo', 'Foo'],
            [[], []],
            [0, [], 1]
        ]);
    },
    'error message': {
        'type': function () {
            assertViolationWithMessage(function () {
                condition()(null);
            }, _.template(errorMessages.Unique.type)({}));
        },
        'duplicateFound': function () {
            assertViolationWithMessage(function () {
                condition()([1, 2, 1]);
            }, _.template(errorMessages.Unique.duplicateFound)({ duplicate: 1, duplicateStr: utils.smartFormat(1) }));
        }
    }
});
