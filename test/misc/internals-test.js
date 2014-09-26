var buster = require('buster');

var lewd = require('../../src/lewd'),
    utils = require('../../src/utils');

var assert = buster.referee.assert,
    refute = buster.referee.refute;

buster.testCase('internals', {
    // some of these tests are just here to make istanbul happy, they can not really occur when using the API
    'lewd': {
        '_wrap': {
            'illegal invocation': function () {
                assert.exception(function () {
                    lewd._wrap(new Date());
                }, 'IllegalParameterException');
            },
            'shorthand support': {
                'Array': function () {
                    assert.equals(lewd._wrap(lewd.Array).wrapped, 'ArrayType');
                },
                'Boolean': function () {
                    assert.equals(lewd._wrap(lewd.Boolean).wrapped, 'BooleanType');
                },
                'null': function () {
                    assert.equals(lewd._wrap(lewd.null).wrapped, 'NullType');
                },
                'Number': function () {
                    assert.equals(lewd._wrap(lewd.Number).wrapped, 'NumberType');
                },
                'Object': function () {
                    assert.equals(lewd._wrap(lewd.Object).wrapped, 'ObjectType');
                },
                'String': function () {
                    assert.equals(lewd._wrap(lewd.String).wrapped, 'StringType');
                },
                'undefined': function () {
                    assert.equals(lewd._wrap(lewd.undefined).wrapped, 'Any');
                },
                'creditcard': function () {
                    assert.equals(lewd._wrap(lewd.creditcard).wrapped, 'Creditcard');
                },
                'email': function () {
                    assert.equals(lewd._wrap(lewd.email).wrapped, 'Email');
                },
                'ip': function () {
                    assert.equals(lewd._wrap(lewd.ip).wrapped, 'Ip');
                },
                'isbn': function () {
                    assert.equals(lewd._wrap(lewd.isbn).wrapped, 'Isbn');
                },
                'fqdn': function () {
                    assert.equals(lewd._wrap(lewd.fqdn).wrapped, 'Fqdn');
                },
                'unique': function () {
                    assert.equals(lewd._wrap(lewd.unique).wrapped, 'Unique');
                },
                'url': function () {
                    assert.equals(lewd._wrap(lewd.url).wrapped, 'Url');
                },
                'uuid': function () {
                    assert.equals(lewd._wrap(lewd.uuid).wrapped, 'Uuid');
                },
                'integer': function () {
                    assert.equals(lewd._wrap(lewd.integer).wrapped, 'Integer');
                },
                'isoDateTime': function () {
                    assert.equals(lewd._wrap(lewd.isoDateTime).wrapped, 'IsoDateTime');
                }
            }
        }
    },
    'Condition': {
        'invoking validate() on the base class': function () {
            assert.exception(function () {
                (new lewd.Condition('BuggyCondition')).validate();
            }, 'Error');
        }
    },
    'Exception': {
        'ConditionViolationException': function () {
            var exception = new lewd.ConditionViolationException(42, ['foo', 'bar'], '');
            
            assert.match(
                exception.toString(),
                'Condition violation at "/foo/bar":'
            );
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
                assert.equals(utils.smartFormat(1 / 0), 'PositiveInfinity');
                assert.equals(utils.smartFormat(-1 / 0), 'NegativeInfinity');
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
        'isBasicObject': function () {
            [{}, Object.create(null), Object.create(function () {})].forEach(function (value) {
                assert(utils.isBasicObject(value));
            });
            [String, Number, Array, Boolean, Date, RegExp, Object,
                'foo', 42, [], true, false, new Date(), /x/,
                null, undefined, NaN, Infinity, function () {}
            ].forEach(function (value) {
                refute(utils.isBasicObject(value));
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
