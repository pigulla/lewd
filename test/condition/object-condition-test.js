var _ = require('lodash'),
    buster = require('buster');

var helper = require('./../helper'),
    errorMessages = require('../../src/messages'),
    lewd = require('../../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationAt = helper.assertViolationAt,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var assert = buster.referee.assert,
    refute = buster.referee.refute;

var condition = lewd.object;

buster.testCase('"object" condition', {
    '{}': function () {
        var args = [
            {}
        ];

        refuteValues(condition, args, [
            '', [], { b: 42 }
        ]);
        acceptValues(condition, args, [
            /*jshint -W010*/
            {}, new Object(), Object.create(null)
            /*jshint +W010*/
        ]);
    },
    'simple': {
        '{ b: Boolean }': function () {
            var args = [
                { b: Boolean }
            ];
    
            refuteValues(condition, args, [
                '', [], {}, { b: 42 }, { b: null }, { b: 0 }, { b: {} }, { y: true },
                { b: true, x: false }, { b: false, x: {} }
            ]);
            acceptValues(condition, args, [
                { b: true }, { b: false }
            ]);
        },
        '{ b: Boolean } (extras allowed)': function () {
            var args = [
                { b: Boolean },
                { allowExtra: true }
            ];
    
            refuteValues(condition, args, ['', [], {}, { b: 42 }, { b: null }, { b: 0 }, { b: {} }, { y: true }]);
            acceptValues(condition, args, [
                { b: true }, { b: false },
                { b: true, x: 42 },
                { b: false, y: {} }
            ]);
        },
        '{ n: Number, a: [] }': function () {
            var args = [
                { n: Number, a: [] }
            ];
    
            refuteValues(condition, args, [
                '', [], {}, { x: 42 }, { n: null }, { n: 0 }, { n: {} }, { n: true },
                { n: 42, a: null }, { n: 0, a: {} }, { n: 99, a: 14 }
            ]);
            acceptValues(condition, args, [
                { n: 42, a: [] },
                { n: 17.3, a: [null, {}] }
            ]);
        },
        '{ s: String, b: optional(Boolean) } (required by default)': function () {
            var args = [{
                s: String,
                b: lewd.optional(Boolean)
            }, { byDefault: 'required' }];
            
            refuteValues(condition, args, [
                { b: true },
                { s: '', b: 42 },
                { s: 'hello', x: null },
                { s: '', b: true, x: 42 }
            ]);
            acceptValues(condition, args, [
                { s: 'hello' },
                { s: '', b: true }
            ]);
        },
        '{ s: String, b: forbidden(Boolean) } (required by default)': function () {
            var args = [{
                s: String,
                b: lewd.forbidden(Boolean)
            }, { byDefault: 'required' }];
            
            refuteValues(condition, args, [
                { b: true },
                { s: '', b: 42 },
                { s: 'hello', x: null },
                { s: '', b: true, x: 42 },
                { s: '', b: true }
            ]);
            acceptValues(condition, args, [
                { s: 'hello' },
                { s: '' }
            ]);
        },
        '{ s: String, b: lewd.required(Boolean) } (optional by default)': function () {
            var args = [{
                s: String,
                b: lewd.required(Boolean)
            }, { byDefault: 'optional' }];
            
            refuteValues(condition, args, [
                { s: 'hello' },
                { s: '', b: 42 },
                { b: true, x: null },
                { s: '', b: true, x: 42 }
            ]);
            acceptValues(condition, args, [
                { b: true },
                { s: '', b: true }
            ]);
        }
    },
    'allOptional functionality': {
        'marks all properties optional': function () {
            var cond = lewd({
                s: String,
                o: Object,
                n: Number
            }).allOptional();
            
            refute.exception(function () {
                cond({ s: 's', o: {} });
                cond({ s: 's', n: 42 });
                cond({ o: {}, n: 42 });
                cond({});
            });

            assert.exception(function () {
                cond({ s: 's', o: {}, n: 42, x: undefined });
            }, 'ConditionViolationException');
            assert.exception(function () {
                cond({ s: 's', o: {}, n: 'not a number' });
            }, 'ConditionViolationException');
        },
        'can be overridden afterwards': function () {
            var cond = lewd({
                s: String,
                n: lewd(Number).as('n')
            }).allOptional();
            
            cond.get('n').required();
            
            refute.exception(function () {
                cond({ s: '', n: 42 });
                cond({ n: 42 });
            });
            
            assert.exception(function () {
                cond({ s: '' });
            }, 'ConditionViolationException');
        }
    },
    'allRequired functionality': {
        'marks all properties required': function () {
            var cond = lewd({
                s: lewd(String).optional(),
                o: lewd(Object).optional(),
                n: lewd(Number).optional()
            }).allRequired();
            
            refute.exception(function () {
                cond({ s: 's', o: {}, n: 42 });
            });

            assert.exception(function () {
                cond({ s: 's', o: {} });
            }, 'ConditionViolationException');
            assert.exception(function () {
                cond({ s: 's', n: 42 });
            }, 'ConditionViolationException');
            assert.exception(function () {
                cond({ o: {}, n: 42 });
            }, 'ConditionViolationException');
            assert.exception(function () {
                cond({});
            }, 'ConditionViolationException');
        },
        'can be overridden afterwards': function () {
            var cond = lewd({
                s: lewd(String).optional().as('s'),
                o: lewd(Object).optional().as('o'),
                n: lewd(Number).optional().as('n')
            }).allRequired();
            
            cond.get('o').optional();
            
            refute.exception(function () {
                cond({ s: '', o: {}, n: 42 });
                cond({ s: '', n: 42 });
            });
            
            assert.exception(function () {
                cond({ o: '', n: 42 });
            }, 'ConditionViolationException');
            assert.exception(function () {
                cond({ s: '', o: {} });
            }, 'ConditionViolationException');
        }
    },
    'nested': {
        '{ s: String, o: { a: [String], u: undefined } }': function () {
            var args = [{
                s: String,
                o: {
                    a: [String],
                    u: undefined
                }
            }];

            refuteValues(condition, args, [
                { s: 'hello' },
                { s: '', o: null },
                { s: true, o: {} },
                { s: '', o: {}, x: 42 },
                { s: '', o: {} },
                { s: '', o: { a: [] } }
            ]);
            acceptValues(condition, args, [
                { s: '', o: { a: [], u: null } },
                { s: '', o: { a: ['x', 'y'], u: [] } }
            ]);
        }
    },
    'keys': {
        '{ $k: /^[a-z]+$/ }': function () {
            var args = [{
                $k: /^[a-z]+$/
            }, { allowExtra: true }];
            
            refuteValues(condition, args, [
                { 1: true, a: 0 },
                { a: [], B: 42 },
                { abc: 'def', ghi: null, jK: null }
            ]);
            acceptValues(condition, args, [
                {},
                { abc: null },
                { d: 42, e: null, f: true }
            ]);
        },        
        '{ $k: some(/^\\d$/, some("a", "b")) }': function () {
            var args = [{
                $k: lewd.some(/^\d$/, lewd.some('a', 'b'))
            }, { allowExtra: true }];
            
            refuteValues(condition, args, [
                { 1: true, c: 0 },
                { a: [], B: 42 },
                { 1: 'def', a: null, A: null }
            ]);
            acceptValues(condition, args, [
                {},
                { 1: null },
                { 1: 42, a: null, b: true },
                { a: 42 }
            ]);
        },
        '{ $k: function } (extras allowed)': function () {
            assert.exception(function () {
                condition({ $k: function () { x(); } }, { removeExtra: true })({ n: 0 });  // jshint ignore:line                
            }, 'ReferenceError');
        }
    },
    'keys with no extras allowed': {
        '{ $k: /^a/, x: undefined }': function () {
            var args = [{
                $k: /^a/, x: undefined
            }];
            
            refuteValues(condition, args, [
                {},
                { y: 42 },
                { x: null, y: 42 }
            ]);
            acceptValues(condition, args, [
                { x: 42 }
            ]);
        }
    },
    'values': {
        '{ $v: Number }': function () {
            var args = [{ $v: Number }, { allowExtra: true }];
            
            refuteValues(condition, args, [
                { x: '' },
                { x: false },
                { x: 13, y: null },
                { x: 42, y: '' },
                { x: 42, y: {} }
            ]);
            acceptValues(condition, args, [
                {},
                { x: 42 },
                { x: 13, y: 17 },
                { x: -99, z: 13, v: 0 }
            ]);
        },
        '{ $v: some("x", 42) }': function () {
            var args = [{ $v: lewd.some('x', 42) }, { allowExtra: true }];
            
            refuteValues(condition, args, [
                { x: '' },
                { x: 43 },
                { x: 'x', y: null },
                { x: 'x', y: '' },
                { x: 42, y: '' }
            ]);
            acceptValues(condition, args, [
                {},
                { x: 42 },
                { x: 'x', y: 'x' },
                { x: 42, z: 42, v: 'x' }
            ]);
        }
    },
    'keys and values': {
        '{ $k: /^[a-z]+$/, $v: String }': function () {
            var args = [{ $k: /^[a-z]+$/, $v: String }, { allowExtra: true }];
            
            refuteValues(condition, args, [
                { HELLO: 42 },
                { hello: 'world', ORLY: true },
                { hiThere: '' } 
            ]);
            acceptValues(condition, args, [
                {},
                { hello: 'world', ping: 'pong' },
                { a: '', b: '', c: '' }
            ]);
        }
    },
    'keys and values as options': {
        '{ $k: String } (keys: Number)': function () {
            var args = [{ $k: String }, { allowExtra: true, keys: /^[a-z]/ }];
            
            refuteValues(condition, args, [
                { $k: 42, abc: 42 },
                { $k: '', Abc: 42 },
                { abc: 42 },
                {}
            ]);
            acceptValues(condition, args, [
                { $k: 'foo' },
                { $k: 'foo', abc: true }
            ]);
        },
        '{ $v: String } (values: Number)': function () {
            var args = [{ $v: String }, { allowExtra: true, values: Number }];
            
            refuteValues(condition, args, [
                { $v: 42, x: 42 },
                { $v: '', x: '42' },
                { x: 42 },
                {}
            ]);
            acceptValues(condition, args, [
                { $v: 'foo' },
                { $v: 'foo', abc: 42 }
            ]);
        }
    },
    'allowExtra default': {
        'false by default': function () {
            var args = [{ k: Number }];

            refuteValues(condition, args, [
                { k: '42' },
                { k: 42, x: '' },
                {}
            ]);
            acceptValues(condition, args, [
                { k: 42 }
            ]);
        },
        'true by default if $k': function () {
            var args = [{ n: Number, $k: /^x/ }];

            refuteValues(condition, args, [
                { n: '42' },
                { n: 42, ax: '' },
                {}
            ]);
            acceptValues(condition, args, [
                { n: 42 },
                { n: 42, x: '' }
            ]);
        },
        'true by default if $k but can be overridden': function () {
            var args = [{ n: Number, $k: /^x/ }, { allowExtra: false }];

            refuteValues(condition, args, [
                { n: '42' },
                { n: 42, ax: '' },
                { n: 42, x: '' },
                {}
            ]);
            acceptValues(condition, args, [
                { n: 42 }
            ]);
        }
    },
    'removeExtra': {
        '{ a: Number, b: Number } (with removeExtra}': function () {
            var o = { a: 1, b: 2, c: 3 };
            condition({ a: Number, b: Number }, { removeExtra: true })(o);
            
            assert.equals({ a: 1, b: 2 }, o);
        },
        '{ $k: /^[a-z]+$/i } (with removeExtra}': function () {
            var o = { a: 1, B: 2, $foo: false, 1: 0 };
            condition({ $k: /^[a-z]+$/i }, { removeExtra: true })(o);
            
            assert.equals({ a: 1, B: 2 }, o);
        },
        '{ $k: /^a/, $v: Number } (with removeExtra}': function () {
            var o = { a: 1, aa: 4, b: 2, $foo: false };
            condition({ $k: /^a/, $v: Number }, { removeExtra: true })(o);
            
            assert.equals({ a: 1, aa: 4 }, o);
        }
    },
    'default values': {
        'doesn\'t break anything': function () {
            refute.exception(function () {
                condition({ a: lewd.Number().optional().default(42) })({});
            });
        },
        'is applied': function () {
            assert.equals(
                condition({ a: lewd.Number().optional().default(42) })({}),
                { a: 42 }
            );
        },
        'makes the property optional': function () {
            refute.exception(function () {
                condition({ a: lewd.Number().default(42) })({});
            });
        },
        'is not applied if not optional': function () {
            assert.exception(function () {
                condition({ a: lewd.Number().default(42).required() })({});
            }, 'ConditionViolationException');
        },
        'doesn\'t overwrite the actual value': function () {
            assert.equals(
                condition({ a: lewd.Number().optional().default(42) })({ a: 13 }),
                { a: 13 }
            );
        },
        'is still validated': function () {
            assert.exception(function () {
                condition({ a: lewd.Number().optional().default('42') })({});
            }, 'ConditionViolationException');
        }
    },
    'property states changed between validations': function () {
        var condC = lewd.forbidden(Number),
            c = condition({
                a: lewd.integer(),
                b: lewd.optional(String),
                c: condC
            }, { byDefault: 'required' });

        refute.exception(function () {
            c({ a: 42, b: '' });
            c({ a: 42 });
        });
        assertViolationAt(function () {
            c({ a: 42, c: 42 });
        }, []);
        
        condC.optional();
        refute.exception(function () {
            c({ a: 42, b: '' });
            c({ a: 42 });
            c({ a: 42, c: 42 });
        });
        
        condC.required();
        refute.exception(function () {
            c({ a: 42, b: '', c: 42 });
            c({ a: 42, c: 42 });
        });
        assert.exception(function () {
            c({ a: 42, b: '' });
        });
        assert.exception(function () {
            c({ a: 42 });
        });
        assertViolationAt(function () {
            c({ a: 42, c: '42' });
        }, ['c']);
    },
    'passes exceptions through': {
        'value': function () {
            assert.exception(function () {
                condition({
                    a: function () { x(); }  // jshint ignore:line
                })({ a: 0 }); 
            }, 'ReferenceError');

            assert.exception(function () {
                condition({
                    $v: function () { x(); }  // jshint ignore:line
                }, { allowExtra: true, removeExtra: true })({ x: 0 });
            }, 'ReferenceError');
        },
        'key': function () {
            assert.exception(function () {
                condition({
                    $k: function () { x(); }  // jshint ignore:line
                })({ a: 42 });
            }, 'ReferenceError');

            assert.exception(function () {
                condition({
                    a: function () { x(); }  // jshint ignore:line
                }, { removeExtra: true })({ a: 0 });
            }, 'ReferenceError');
        }
    },
    'error message': {
        'type': function () {
            assertViolationWithMessage(function () {
                condition({})(42);
            }, _.template(errorMessages.Object.type, {}));
        },
        'unexpectedKey': {
            'extra': function () {
                assertViolationWithMessage(function () {
                    condition({})({ x: null });
                }, _.template(errorMessages.Object.unexpectedKey, { key: 'x' }));
            },
            'forbidden': function () {
                assertViolationWithMessage(function () {
                    condition({ x: lewd.forbidden(undefined) })({ x: null });
                }, _.template(errorMessages.Object.unexpectedKey, { key: 'x' }));
            }
        },
        'missingKey': function () {
            assertViolationWithMessage(function () {
                condition({ x: undefined })({});
            }, _.template(errorMessages.Object.missingKey, { key: 'x' }));
        }
    },
    'custom error message': {
        'type': function () {
            assertViolationWithMessage(function () {
                condition({}).because('reason: ${originalMessage}')(42);
            }, 'reason: ' + _.template(errorMessages.Object.type, {}));
        }
    },
    'invalid schema options': function () {
        refuteSchemaOptions(condition, [{}, { allowExtra: 42 }]);
        refuteSchemaOptions(condition, [{}, { removeExtra: 42 }]);
        refuteSchemaOptions(condition, [{}, { unknownKey: ['w00t'] }]);
        refuteSchemaOptions(condition, [{}, { optional: 'w00t' }]);
        refuteSchemaOptions(condition, [{}, { byDefault: 'whatever' }]);
    }
});
