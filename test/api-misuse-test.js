var buster = require('buster'),
    Set = require('harmony-collections').Set;

var lewd = require('../src/lewd');

buster.testCase('api misuse', {
    'wrong parameter count for lewd': function () {
        buster.referee.assert.exception(function () {
            lewd();
        }, 'WrongParameterException');
    },
    'set with non-literals': function () {
        buster.referee.assert.exception(function () {
            lewd(Set([1, 2, {}]));
        }, 'InvalidSchemaException');
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
