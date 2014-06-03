var buster = require('buster');

var lewd = require('../src/lewd'),
    utils = require('../src/utils');

var assert = buster.referee.assert,
    refute = buster.referee.refute;

buster.testCase('internals', {
    // some of these tests are just here to make istanbul happy, they can not really occur when using the API
    'lewd': {
        '_wrap': function () {
            assert.exception(function () {
                lewd._wrap(new Date());
            }, 'IllegalParameterException');
        }
    },
    'Condition': {
        'invoking validate() on the base class': function () {
            assert.exception(function () {
                (new lewd.Condition('BuggyCondition')).validate();
            }, 'Error');
        }
    },
    'utils': {
        'smartFormat': {
            'true/false': function () {
                assert.equals(utils.smartFormat(true), '<boolean>true');
                assert.equals(utils.smartFormat(false), '<boolean>false');
            },
            'strings': function () {
                assert.equals(utils.smartFormat('short'), '<string:5>"short"');
                assert.equals(utils.smartFormat('a bit too long'), '<string:14>"a bit t..."');
            },
            'numbers': function () {
                assert.equals(utils.smartFormat(42), '<number>42');
                assert.equals(utils.smartFormat(17.13), '<number>17.13');
            },
            'objects': function () {
                assert.equals(utils.smartFormat({}), 'object');
                assert.equals(utils.smartFormat(Object.create(null)), 'object');
            },
            'null/undefined': function () {
                assert.equals(utils.smartFormat(null), 'null');
                assert.equals(utils.smartFormat(undefined), 'undefined');
            },
            'NaN/Infinity': function () {
                assert.equals(utils.smartFormat(NaN), 'NaN');
                assert.equals(utils.smartFormat(1/0), 'PositiveInfinity');
                assert.equals(utils.smartFormat(-1/0), 'NegativeInfinity');
            },
            'Date': function () {
                var date = new Date();
                assert.equals(utils.smartFormat(date), '<date>' + date.toISOString());
            },
            'Regexp': function () {
                assert.equals(utils.smartFormat(/^[a-z]+/), '<regexp>/^[a-z]+/');
            },
            'arguments': function () {
                assert.equals(utils.smartFormat(arguments), '<arguments:0>');
            },
            'Array': function () {
                assert.equals(utils.smartFormat([1, 2, 3]), '<array:3>');
            },
            'functions': function () {
                var fn = function fn() {},
                    anonymous = function () {};
                
                assert.equals(utils.smartFormat(fn), '<function>fn');
                assert.equals(utils.smartFormat(anonymous), '<function>anonymous');
            }
        },
        'isJsonType': function () {
            [null, String, Number, Object, Boolean].forEach(function (value) {
                assert(utils.isJsonType(value));
            });
            [true, 42, 'x', new Date(), /x/, undefined, function () {}, NaN, Infinity].forEach(function (value) {
                refute(utils.isJsonType(value));
            });
        },
        'isLiteral': function () {
            [null, 'string', '', 42, -17.3, true, false].forEach(function (value) {
                assert(utils.isLiteral(value));
            });
            [{}, [], new Date(), /x/, undefined, function () {}, NaN, Infinity].forEach(function (value) {
                refute(utils.isLiteral(value));
            });
        }
    }
});