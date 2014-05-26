var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

var condition = lewd.all;

buster.testCase('"all" condition', {
    'no condition': function () {
        var args = [];

        acceptValues(condition, args, [0, false, 'foo', null, [], {}, ['blub']]);
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
    }
});
