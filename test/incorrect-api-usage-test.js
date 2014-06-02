var buster = require('buster');

var lewd = require('../src/lewd');

/*jshint nonew:false */

buster.testCase('api misuse', {
    'wrong parameter count for lewd': function () {
        buster.referee.assert.exception(function () {
            lewd();
        }, 'IllegalParameterException');
    },
    'wrong parameter for lewd.custom': function () {
        buster.referee.assert.exception(function () {
            lewd.custom(0);
        }, 'IllegalParameterException');
    },
    'wrong parameter count for conditions': function () {
        buster.referee.assert.exception(function () {
            lewd.custom();
        }, 'IllegalParameterException');
        
        buster.referee.assert.exception(function () {
            lewd.Boolean(true);
        }, 'IllegalParameterException');

        buster.referee.assert.exception(function () {
            lewd.object({}, {}, false);
        }, 'IllegalParameterException');

        buster.referee.assert.exception(function () {
            lewd.object();
        }, 'IllegalParameterException');
    },
    'unsupported coercion': function () {
        buster.referee.assert.exception(function () {
            lewd.Object().coerce();
        }, 'IllegalParameterException');
    },
    'incorrectly instantiated conditions': {
        'all': function () {
            var All = require('../src/condition/logic/All');
            buster.referee.assert.exception(function () {
                new All('');
            }, 'IllegalParameterException');
        },
        'array': function () {
            var Array = require('../src/condition/content/Array');
            buster.referee.assert.exception(function () {
                new Array('');
            }, 'IllegalParameterException');
        },
        'none': function () {
            var None = require('../src/condition/logic/None');
            buster.referee.assert.exception(function () {
                new None('');
            }, 'IllegalParameterException');
        },
        'some': function () {
            var Some = require('../src/condition/logic/Some');
            buster.referee.assert.exception(function () {
                new Some('');
            }, 'IllegalParameterException');
        },
        'custom': function () {
            var Custom = require('../src/condition/Custom');
            buster.referee.assert.exception(function () {
                new Custom('');
            }, 'IllegalParameterException');
        }
    }
});
