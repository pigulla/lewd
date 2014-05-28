var _ = require('lodash'),
    buster = require('buster');

var helper = require('./../helper'),
    errorMessages = require('../../src/messages'),
    lewd = require('../../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

var condition = lewd.object;

buster.testCase('"object" condition', {
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
                { n: 42, x: ''}
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
    'error message': {
        'type': function () {
            assertViolationWithMessage(function () {
                condition({})(42);
            }, _.template(errorMessages.Object.type, {}));
        },
        'unexpectedKey': function () {
            assertViolationWithMessage(function () {
                condition({})({ x: null });
            }, _.template(errorMessages.Object.unexpectedKey, { key: 'x' }));
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
        refuteSchemaOptions(condition, [{}, { unknownKey: ['w00t'] }]);
        refuteSchemaOptions(condition, [{}, { optional: 'w00t' }]);
        refuteSchemaOptions(condition, [{}, { byDefault: 'whatever' }]);
    }
});
