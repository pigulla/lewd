var buster = require('buster');

var lewd = require('../src/lewd');

/*jshint nonew:false */

buster.testCase('incorrect api usage', {
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

        buster.referee.assert.exception(function () {
            lewd.unique(42);
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
            var ArrayC = require('../src/condition/structure/Array');
            buster.referee.assert.exception(function () {
                new ArrayC('');
            }, 'IllegalParameterException');
        },
        'object': function () {
            var ObjectC = require('../src/condition/structure/Object');
            buster.referee.assert.exception(function () {
                new ObjectC('');
            }, 'IllegalParameterException');
        },
        'len': function () {
            var Len = require('../src/condition/content/Len');
            buster.referee.assert.exception(function () {
                new Len('');
            }, 'IllegalParameterException');
        },
        'none': function () {
            var None = require('../src/condition/logic/None');
            buster.referee.assert.exception(function () {
                new None('');
            }, 'IllegalParameterException');
        },
        'range': function () {
            var Range = require('../src/condition/content/Range');
            buster.referee.assert.exception(function () {
                new Range('');
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
