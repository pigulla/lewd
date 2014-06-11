var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('../helper');

var assertViolationAt = helper.assertViolationAt;

buster.testCase('paths in exceptions', {
    'top level': {
        'Boolean': function () {
            assertViolationAt(function () {
                lewd.Boolean()(42);
            }, []);
        },
        'String': function () {
            assertViolationAt(function () {
                lewd.String()(42);
            }, []);
        }
    },
    'object': {
        '{ b: Boolean }': function () {
            assertViolationAt(function () {
                lewd.object({ b: Boolean })({ b: null });
            }, ['b']);
        },
        '{ a: String, b: Boolean }': function () {
            assertViolationAt(function () {
                lewd.object({ a: String, b: Boolean })({ a: '', b: null });
            }, ['b']);
        },
        '{ s: lewd.all(String, lewd.len({ min: 1, max: 10 })) }': function () {
            assertViolationAt(function () {
                lewd.object({ s: lewd.all(String, lewd.len({ min: 1, max: 10 })) })({ s: '' });
            }, ['s']);
        },
        '{ n: all(Number, some(range({ max: 5 }), range({ min: 10, max: 99 })) }': function () {
            assertViolationAt(function () {
                lewd.object({
                    n: lewd.all(
                        Number,
                        lewd.some(lewd.range({ max: 5 }), lewd.range({ min: 10, max: 99 }))
                    )
                })({ n: 100 });
            }, ['n']);
        },
        '{ a: { b: { c: null } } }': function () {
            assertViolationAt(function () {
                lewd.object({ a: { b: { c: null } } })({ a: { b: { c: 42 } } });
            }, ['a', 'b', 'c']); 
        }
    },
    'array': {
        '[Number]': function () {
            assertViolationAt(function () {
                lewd.array(Number)([1, 2, '3', 4]);
            }, ['#2']);
        },
        '[[String]]': function () {
            assertViolationAt(function () {
                lewd.array([String])([[], ['a'], [], ['3', 4, '5']]);
            }, ['#3', '#1']);
        }
    },
    'combined': {
        '{ a: [{ b: [String] }]': function () {
            assertViolationAt(function () {
                lewd.object({ a: [{ b: [String] }] })({ a: [{ b: ['x', 42] }] });
            }, ['a', '#0', 'b', '#1']);
        }
    }
});
