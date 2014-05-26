var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

var condition = lewd.range;

buster.testCase('"range" condition', {
    'minimum': function () {
        var args = [{ min: 0 }];
        
        refuteValues(condition, args, [-1]);
        acceptValues(condition, args, [1, 0]);
    },
    'maximum': function () {
        var args = [{ max: 50 }];
        
        refuteValues(condition, args, [100]);
        acceptValues(condition, args, [30, 50]);
    },
    'minimum exclusive': function () {
        var args = [{ min: 0, minInclusive: false }];
        
        refuteValues(condition, args, [0]);
        acceptValues(condition, args, [0.001]);
    },
    'maximum exclusive': function () {
        var args = [{ max: 50, maxInclusive: false }];

        refuteValues(condition, args, [50]);
        acceptValues(condition, args, [49]);
    },
    'all args': function () {
        var args = [{
            min: 13,
            max: 99,
            minInclusive: false,
            maxInclusive: true
        }];

        refuteValues(condition, args, [-5, 13, 100]);
        acceptValues(condition, args, [13.1, 49, 99]);
    }
});
