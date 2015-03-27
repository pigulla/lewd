'use strict';

var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper'),
    utils = require('../../src/utils');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.literal;

buster.testCase('"literal" condition', {
    'string': function () {
        var args = ['x'];

        refuteValues(condition, args, [0, -17.3, false, 'foo', 'X', null, [], {}, ['foo']]);
        acceptValues(condition, args, ['x']);
    },
    'number': function () {
        var args = [42];

        refuteValues(condition, args, [0, 42.001, -17.3, false, 'foo', 'X', null, [], {}, ['foo']]);
        acceptValues(condition, args, [42]);
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition('x')({});
        }, _.template(errorMessages.Literal)({ literal: 'x', literalStr: utils.smartFormat('x') }));
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [[]]);
        refuteSchemaOptions(condition, [{}]);
        refuteSchemaOptions(condition, [undefined]);
        refuteSchemaOptions(condition, [Infinity]);
        refuteSchemaOptions(condition, [NaN]);
    }
});
