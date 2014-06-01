var buster = require('buster');

var lewd = require('../src/lewd');

/*jshint nonew:false */

buster.testCase('api misuse', {
    'wrong parameter count for lewd': function () {
        buster.referee.assert.exception(function () {
            lewd();
        }, 'WrongParameterException');
    },
    'wrong parameter for lewd.custom': function () {
        buster.referee.assert.exception(function () {
            lewd.custom(0);
        }, 'WrongParameterException');
    },
    'wrong parameter count for conditions': function () {
        buster.referee.assert.exception(function () {
            lewd.custom();
        }, 'WrongParameterException');
        
        buster.referee.assert.exception(function () {
            lewd.Boolean(true);
        }, 'WrongParameterException');

        buster.referee.assert.exception(function () {
            lewd.object({}, {}, false);
        }, 'WrongParameterException');

        buster.referee.assert.exception(function () {
            lewd.object();
        }, 'WrongParameterException');
    },
    'unsupported coercion': function () {
        buster.referee.assert.exception(function () {
            lewd.Object().coerce();
        }, 'InvalidSchemaException');
    },
    'incorrectly instantiated conditions': {
        'all': function () {
            var All = require('../src/condition/logic/All');
            buster.referee.assert.exception(function () {
                new All('');
            }, 'WrongParameterException');
        },
        'array': function () {
            var Array = require('../src/condition/content/Array');
            buster.referee.assert.exception(function () {
                new Array('');
            }, 'WrongParameterException');
        },
        'none': function () {
            var None = require('../src/condition/logic/None');
            buster.referee.assert.exception(function () {
                new None('');
            }, 'WrongParameterException');
        },
        'some': function () {
            var Some = require('../src/condition/logic/Some');
            buster.referee.assert.exception(function () {
                new Some('');
            }, 'WrongParameterException');
        }
    }
});
