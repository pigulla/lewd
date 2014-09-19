var buster = require('buster');

var lewd = require('../../src/lewd');

var assert = buster.referee.assert;

/*jshint nonew:false */

buster.testCase('incorrect api usage', {
    'wrong parameter count for lewd': function () {
        assert.exception(function () {
            lewd();
        }, 'IllegalParameterException');
    },
    'wrong parameter for lewd.custom': function () {
        assert.exception(function () {
            lewd.custom(0);
        }, 'IllegalParameterException');
    },
    'wrong parameter count for conditions': function () {
        assert.exception(function () {
            lewd.custom();
        }, 'IllegalParameterException');
        
        assert.exception(function () {
            lewd.Boolean(true);
        }, 'IllegalParameterException');

        assert.exception(function () {
            lewd.object({}, {}, false);
        }, 'IllegalParameterException');

        assert.exception(function () {
            lewd.object();
        }, 'IllegalParameterException');

        assert.exception(function () {
            lewd.unique(42);
        }, 'IllegalParameterException');
    },
    'unsupported coercion': function () {
        assert.exception(function () {
            lewd.Object().coerce();
        }, 'IllegalParameterException');
    },
    'incorrectly instantiated conditions': {
        'all': function () {
            var All = require('../../src/condition/logic/All');
            assert.exception(function () {
                new All('');
            }, 'IllegalParameterException');
        },
        'array': function () {
            var ArrayC = require('../../src/condition/structure/Array');
            assert.exception(function () {
                new ArrayC('');
            }, 'IllegalParameterException');
        },
        'object': function () {
            var ObjectC = require('../../src/condition/structure/Object');
            assert.exception(function () {
                new ObjectC('');
            }, 'IllegalParameterException');
        },
        'len': function () {
            var Len = require('../../src/condition/content/Len');
            assert.exception(function () {
                new Len('');
            }, 'IllegalParameterException');
        },
        'none': function () {
            var None = require('../../src/condition/logic/None');
            assert.exception(function () {
                new None('');
            }, 'IllegalParameterException');
        },
        'range': function () {
            var Range = require('../../src/condition/content/Range');
            assert.exception(function () {
                new Range('');
            }, 'IllegalParameterException');
        },
        'some': function () {
            var Some = require('../../src/condition/logic/Some');
            assert.exception(function () {
                new Some('');
            }, 'IllegalParameterException');
        },
        'custom': function () {
            var Custom = require('../../src/condition/Custom');
            assert.exception(function () {
                new Custom('');
            }, 'IllegalParameterException');
        }
    }
});
