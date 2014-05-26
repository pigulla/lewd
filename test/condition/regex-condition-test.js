var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.regex;

buster.testCase('"regex" condition', {
    'simple': function () {
        var args = [/^a/];

        refuteValues(condition, args, ['', 42, true, [], null, 'bcd', '1a', 'A']);
        acceptValues(condition, args, ['a', 'a42', 'aaa']);
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [42]);
        refuteSchemaOptions(condition, ['blub']);
        refuteSchemaOptions(condition, [null]);
        refuteSchemaOptions(condition, [[]]);
        refuteSchemaOptions(condition, [{}]);
        refuteSchemaOptions(condition, [undefined]);
        refuteSchemaOptions(condition, [Infinity]);
        refuteSchemaOptions(condition, [NaN]);
    }
});
