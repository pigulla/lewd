var buster = require('buster');

var lewd = require('../src/lewd');

function assertFailedAt(condition, value, path) {
    try {
        condition(value);
    } catch (e) {
        buster.referee.assert.equals(e.name, 'ConditionViolationException');
        buster.referee.assert.equals(e.path, path);
        return;
    }

    buster.referee.assert(false, 'Condition should have failed');
}


buster.testCase('paths in exceptions', {
    'top level': {
        'Boolean': function () {
            assertFailedAt(lewd.Boolean(), 42, []);
        },
        'String': function () {
            assertFailedAt(lewd.String(), 42, []);
        }
    },
    'object': {
        '{ b: Boolean }': function () {
            assertFailedAt(lewd.object({ b: Boolean }), { b: null }, ['b']);
        },
        '{ a: String, b: Boolean }': function () {
            assertFailedAt(lewd.object({ a: String, b: Boolean }), { a: '', b: null }, ['b']);
        },
        '{ n: all(Number, some(range({ max: 5 }), range({ min: 10, max: 99 })) }': function () {
            assertFailedAt(
                lewd.object({
                    n: lewd.all(
                        Number,
                        lewd.some(lewd.range({ max: 5 }), lewd.range({ min: 10, max: 99 }))
                    )
                }),
                { n: 100 },
                ['n']
            );
        },
        '{ a: { b: { c: null } } }': function () {
            assertFailedAt(lewd.object({ a: { b: { c: null } } }), { a: { b: { c: 42 } } }, ['a', 'b', 'c']); 
        }
    },
    'array': {
        '[Number]': function () {
            assertFailedAt(lewd.array(Number), [1, 2, '3', 4], ['#2']);
        },
        '[[String]]': function () {
            assertFailedAt(lewd.array([String]), [[], ['a'], [], ['3', 4, '5']], ['#3', '#1']);
        }
    },
    'combined': {
        '{ a: [{ b: [String] }]': function () {
            assertFailedAt(
                lewd.object({ a: [{ b: [String] }] }),
                { a: [{ b: ['x', 42] }] },
                ['a', '#0', 'b', '#1']
            );
        }
    }
});
