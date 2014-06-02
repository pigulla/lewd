var util = require('util');

var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../src/lewd'),
    CoercableCondition = require('../src/condition/CoercableCondition');

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
            buster.referee.assert.same(lewd.coerce(Number)('42.3'), 42.3);
        },
        failed: function () {
            buster.referee.assert.exception(function () {
                lewd.Number().coerce()('42x');
            }, 'ConditionViolationException');
        }
    },
    '"isoDateTime" condition': {
        successful: function () {
            var date = new Date(),
                value = lewd.isoDateTime().coerce()(date.toISOString());
            
            buster.referee.assert.hasPrototype(value, Date.prototype);
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
        buster.referee.assert.same(lewd.coerce(Boolean)('1'), true);
    },
    '"String" condition': function () {
        var value = lewd.String().coerce()(42);
        buster.referee.assert.same(value, '42');
    },
    'pass exception through for broken _coerce method': function () {
        var BrokenCondition = function () {
            var strict = lewd(String),
                coercable = lewd(undefined);
            
            CoercableCondition.call(this, 'BrokenCondition', strict, coercable);
        };
        
        util.inherits(BrokenCondition, CoercableCondition);
        
        BrokenCondition.prototype.validate = function (value, path) {
            CoercableCondition.prototype.validate.call(this, value, path, 'its broken!');
        };
        BrokenCondition.prototype._coerce = function (value) {
            x(); // jshint ignore:line
        };
        
        buster.referee.assert.exception(function () {
            (new BrokenCondition()).consumer().coerce()(42);
        }, 'ReferenceError');
    },
    'pass exception through for broken strict condition': function () {
        var BrokenCondition = function () {
            var strict = lewd(function () {
                    x(); // jshint ignore:line
                });
            
            CoercableCondition.call(this, 'BrokenCondition', strict, strict);
        };
        
        util.inherits(BrokenCondition, CoercableCondition);
        
        BrokenCondition.prototype.validate = function (value, path) {
            CoercableCondition.prototype.validate.call(this, value, path, 'its broken!');
        };
        
        buster.referee.assert.exception(function () {
            (new BrokenCondition()).consumer()(42);
        }, 'ReferenceError');
    }
});
