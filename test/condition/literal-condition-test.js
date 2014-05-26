var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.literal;

buster.testCase('"literal" condition', {
    'string': function () {
        var args = ['x'];

        refuteValues(condition, args, [0, -17.3, false, 'foo', 'X', null, [], {}, ['blub']]);
        acceptValues(condition, args, ['x']);
    },
    'number': function () {
        var args = [42];

        refuteValues(condition, args, [0, 42.001, -17.3, false, 'foo', 'X', null, [], {}, ['blub']]);
        acceptValues(condition, args, [42]);
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [[]]);
        refuteSchemaOptions(condition, [{}]);
        refuteSchemaOptions(condition, [undefined]);
        refuteSchemaOptions(condition, [Infinity]);
        refuteSchemaOptions(condition, [NaN]);
    }
});
