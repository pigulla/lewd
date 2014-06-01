var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../src/lewd');

buster.testCase('coercion', {
    '"integer condition"': {
        successful: function () {
            buster.referee.assert.same(lewd.integer().coerce()('42'), 42);
        },
        failed: function () {
            buster.referee.assert.exception(function () {
                lewd.integer().coerce()('42x');
            }, 'ConditionViolationException');
        }
    },
    '"Number condition"': {
        successful: function () {
            buster.referee.assert.same(lewd.Number().coerce()('42.3'), 42.3);
        },
        failed: function () {
            buster.referee.assert.exception(function () {
                lewd.Number().coerce()('42x');
            }, 'ConditionViolationException');
        }
    },
    '"isoDateTime" condition': {
        successful: function () {
            var value = lewd.isoDateTime().coerce()('2014-05-22T07:15:26.692Z');
            buster.referee.assert.hasPrototype(value, Date.prototype);
        },
        failed: function () {
            buster.referee.assert.exception(function () {
                lewd.isoDateTime().coerce()('1234');
            }, 'ConditionViolationException');
        }
    },
    '"Boolean" condition': function () {
        var value = lewd.Boolean().coerce()('1');
        buster.referee.assert.same(value, true);
    },
    '"String" condition': function () {
        var value = lewd.String().coerce()(42);
        buster.referee.assert.same(value, '42');
    }
});
