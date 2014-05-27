var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.regex;

buster.testCase('"regex" condition', {
    'simple': function () {
        var args = [/^a/];

        refuteValues(condition, args, ['', 42, true, [], null, 'bcd', '1a', 'A']);
        acceptValues(condition, args, ['a', 'a42', 'aaa']);
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition(/x/)(42);
        }, _.template(errorMessages.Regex, {}));
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [42]);
        refuteSchemaOptions(condition, ['foo']);
        refuteSchemaOptions(condition, [null]);
        refuteSchemaOptions(condition, [[]]);
        refuteSchemaOptions(condition, [{}]);
        refuteSchemaOptions(condition, [undefined]);
        refuteSchemaOptions(condition, [Infinity]);
        refuteSchemaOptions(condition, [NaN]);
    }
});
