var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('../helper');

var assert = buster.referee.assert,
    refute = buster.referee.refute;

buster.testCase('lock', {
    'works': function () {
        assert.exception(function () {
            lewd(Object).lock().required();
        }, 'ConditionLockedException');
    },
    'does not affect other properties': function () {
        var o = lewd({
            a: lewd(Number).as('a').lock(),
            b: lewd(Number).as('b')
        });
        
        assert.exception(function () {
            o.get('a').required();
        }, 'ConditionLockedException');
        refute.exception(function () {
            o.get('b').required();
        }, 'ConditionLockedException');
    },
    'is applied recursively': function () {
        assert.exception(function () {
            var o = lewd({
                x: lewd({
                    y: lewd(String).as('y'),
                    z: Number
                }).lock()
            });

            o.get('y').required();
        }, 'ConditionLockedException');
    },
    'is applied through nested conditions': function () {
        assert.exception(function () {
            var o = lewd([lewd(String).as('s')]).lock();
            o.get('s').as('foo');
        }, 'ConditionLockedException');
    },
    'is applied to an object\'s $k condition': function () {
        assert.exception(function () {
            var o = lewd({
                $k: lewd(String).as('k')
            }).lock();

            o.get('k').as('foo');
        }, 'ConditionLockedException');
    },
    'is applied to an object\'s $v condition': function () {
        assert.exception(function () {
            var o = lewd({
                $v: lewd(String).as('v')
            }).lock();

            o.get('v').as('foo');
        }, 'ConditionLockedException');
    }
});
