var buster = require('buster');

var lewd = require('../src/lewd');

buster.testCase('api misuse', {
    'wrong parameter count for lewd': function () {
        buster.referee.assert.exception(function () {
            lewd();
        }, 'WrongParameterException');
    },
    'wrong parameter count for conditions': function () {
        buster.referee.assert.exception(function () {
            lewd.Boolean(true);
        }, 'WrongParameterException');

        buster.referee.assert.exception(function () {
            lewd.object({}, {}, false);
        }, 'WrongParameterException');

        buster.referee.assert.exception(function () {
            lewd.object();
        }, 'WrongParameterException');
    }
});
