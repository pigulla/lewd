'use strict';

var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('../helper');

var assert = buster.referee.assert;

buster.testCase('get by name', {
    'top level': function () {
        var c = lewd.Boolean().as('a'),
            result = c.find('a');

        assert.same(c.get('a'), c);
        assert.equals(result.length, 1);
        assert.same(result[0], c);

        assert.same(c.get('foo'), null);
        assert.equals(c.find('foo').length, 0);
    },
    'single nested': {
        'all': function () {
            var c1 = lewd.literal('foo').as('c1'),
                c2 = lewd.integer().as('c2'),
                c3 = lewd.all(c1, c2).as('c3'),
                result;

            result = c3.find('c3');
            assert.equals(result.length, 1);
            assert.same(result[0], c3);

            result = c3.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c3.find('c2');
            assert.equals(result.length, 1);
            assert.same(result[0], c2);
        },
        'none': function () {
            var c1 = lewd.literal('foo').as('c1'),
                c2 = lewd.integer().as('c2'),
                c3 = lewd.none(c1, c2).as('c3'),
                result;

            result = c3.find('c3');
            assert.equals(result.length, 1);
            assert.same(result[0], c3);

            result = c3.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c3.find('c2');
            assert.equals(result.length, 1);
            assert.same(result[0], c2);
        },
        'some': function () {
            var c1 = lewd.literal('foo').as('c1'),
                c2 = lewd.integer().as('c2'),
                c3 = lewd.some(c1, c2).as('c3'),
                result;

            result = c3.find('c3');
            assert.equals(result.length, 1);
            assert.same(result[0], c3);

            result = c3.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c3.find('c2');
            assert.equals(result.length, 1);
            assert.same(result[0], c2);
        },
        'not': function () {
            var c1 = lewd.integer().as('c1'),
                c2 = lewd.not(c1).as('c2'),
                result;

            result = c1.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c2.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c2.find('c2');
            assert.equals(result.length, 1);
            assert.same(result[0], c2);
        }
    },
    'multiple': {
        'nested': function () {
            var c1 = lewd.literal('foo').as('A'),
                c2 = lewd.integer().as('B'),
                c3 = lewd.some(c1, c2).as('C'),
                c4 = lewd.String().as('A'),
                c5 = lewd.all(c3, c4).as('D'),
                result;

            result = c5.find('A');
            assert.equals(result.length, 2);
            assert.contains(result, c1);
            assert.contains(result, c4);
        },
        'same level': function () {
            var c1 = lewd.not(lewd.literal('foo')).as('N'),
                c2 = lewd.not(lewd.integer()).as('N'),
                c3 = lewd.all(c1, c2).as('D'),
                result;

            result = c3.find('N');
            assert.equals(result.length, 2);
            assert.contains(result, c1);
            assert.contains(result, c2);
        }
    },
    'inside objects': {
        'simple': function () {
            var c1 = lewd.literal('foo').as('c1'),
                c2 = lewd.literal('bar').as('c2'),
                c3 = lewd.integer().as('c3'),
                c4 = lewd.some(c1, c2),
                c5 = lewd.object({
                    a: c3,
                    b: c4
                }),
                result;

            result = c5.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c5.find('c3');
            assert.equals(result.length, 1);
            assert.same(result[0], c3);
        },
        'keys and values': function () {
            var c1 = lewd.literal('foo').as('c1'),
                c2 = lewd.literal('bar').as('c2'),
                c3 = lewd.integer().as('c3'),
                c4 = lewd.object({
                    $k: c1,
                    $v: c2,
                    a: c3
                }),
                result;

            result = c4.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c4.find('c2');
            assert.equals(result.length, 1);
            assert.same(result[0], c2);
        },
        'multiplied': function () {
            var c1 = lewd.literal('foo').as('c1'),
                c2 = lewd.literal('bar').as('c2'),
                c3 = lewd.some(c1, c2),
                c4 = lewd.object({
                    a: c3,
                    b: c3
                }),
                result;

            result = c4.find('c1');
            assert.equals(result.length, 1);
            assert.same(result[0], c1);

            result = c4.find('c2');
            assert.equals(result.length, 1);
            assert.same(result[0], c2);
        }
    },
    'inside arrays': function () {
        var c1 = lewd.literal('foo').as('c1'),
            c2 = lewd.literal('bar').as('c2'),
            c3 = lewd.integer().as('c3'),
            c4 = lewd.some(c1, c2),
            c5 = lewd.array([c3, c4]).as('c5'),
            result;

        result = c5.find('c1');
        assert.equals(result.length, 1);
        assert.same(result[0], c1);

        result = c5.find('c3');
        assert.equals(result.length, 1);
        assert.same(result[0], c3);
    }
});
