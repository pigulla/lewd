var util = require('util');

var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    Condition = require('../../src/condition/Condition');

buster.testCase('coercion', {
    'coercion within objects': function () {
        var condition = lewd.object({ a: lewd(Boolean).coerce() }),
            obj = { a: 1 },
            result = condition(obj); 

        buster.referee.assert.same(result, obj);
        buster.referee.assert.equals(result, { a: true });
    },
    'coercion within arrays': function () {
        var condition = lewd([lewd.integer().coerce()]),
            array = [42, 1.3, 0],
            result = condition(array);

        buster.referee.assert.same(result, array);
        buster.referee.assert.equals(result, [42, 1, 0]);
    },
    '"integer condition"': {
        successful: function () {
            buster.referee.assert.same(lewd.integer().coerce()(42), 42);
            buster.referee.assert.same(lewd.integer().coerce()(42.3), 42);
        },
        failed: function () {
            buster.referee.assert.exception(function () {
                lewd.integer().coerce()('42');
            }, 'ConditionViolationException');
            buster.referee.assert.exception(function () {
                lewd.integer().coerce()('42x');
            }, 'ConditionViolationException');
        }
    }, 
    '"isoDateTime" condition': {
        successful: function () {
            var date = new Date(),
                value = lewd.isoDateTime().coerce()(date.toISOString());
            
            buster.referee.assert(_.isDate(value), 'Value is a Date object');
            buster.referee.assert.same(value.getTime(), date.getTime());
        },
        failed: function () {
            buster.referee.assert.exception(function () {
                lewd.isoDateTime().coerce()('1234');
            }, 'ConditionViolationException');
        }
    },
    '"Boolean" condition': function () {
        buster.referee.assert.same(lewd.Boolean().coerce()('1'), true);
        buster.referee.assert.same(lewd.Boolean().coerce()(0), false);
        buster.referee.assert.same(lewd.coerce(Boolean)('1'), true);
        buster.referee.assert.same(lewd.coerce(Boolean)(0), false);
    },
    '"String" condition': function () {
        var value = lewd.String().coerce()(42);
        buster.referee.assert.same(value, '42');
    }
});
