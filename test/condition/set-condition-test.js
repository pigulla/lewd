var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.set;

buster.testCase('"set" condition', {
    'empty': function () {
        var args = [];

        refuteValues(condition, args, [0, false, 'foo', null, [], {}, ['blub']]);
    },
    'small numbers': function () {
        var args = [1, 2, 3, 4];

        refuteValues(condition, args, [false, 'foo', null, [], {}, ['blub'], 0, 5, 2.2]);
        acceptValues(condition, args, [1, 2, 3, 4]);
    },
    'mixed values': function () {
        var args = [1, 'one', '1', true];

        refuteValues(condition, args, [false, 'foo', null, [], {}, ['blub'], 0, 5, 2.2]);
        acceptValues(condition, args, [1, 'one', '1', true]);
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [{}]);
        refuteSchemaOptions(condition, [[]]);
        refuteSchemaOptions(condition, [undefined]);
        refuteSchemaOptions(condition, [Infinity]);
        refuteSchemaOptions(condition, [NaN]);
    }
});
