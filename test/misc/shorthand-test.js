'use strict';

var _ = require('lodash'),
    buster = require('buster');

var helper = require('../helper'),
    errorMessages = require('../../src/messages'),
    lewd = require('../../src/lewd'),
    BooleanTypeCondition = require('../../src/condition/type/Boolean');

var assert = buster.referee.assert;

buster.testCase('shorthand syntax', {
    'Boolean': function () {
        assert.equals(lewd(Boolean).wrapped, 'BooleanType');
    },
    'Array': function () {
        assert.equals(lewd(Array).wrapped, 'ArrayType');
    },
    'Object': function () {
        assert.equals(lewd(Object).wrapped, 'ObjectType');
    },
    'String': function () {
        assert.equals(lewd(String).wrapped, 'StringType');
    },
    'Number': function () {
        assert.equals(lewd(Number).wrapped, 'NumberType');
    },
    'null': function () {
        assert.equals(lewd(null).wrapped, 'NullType');
    },
    'undefined': function () {
        assert.equals(lewd(undefined).wrapped, 'Ignore');
    },
    'ignore': function () {
        assert.equals(lewd(undefined).wrapped, 'Ignore');
    },
    '[1, 2, 3]': function () {
        assert.equals(lewd([1, 2, 3]).wrapped, 'Array');
    },
    '{}': function () {
        assert.equals(lewd({}).wrapped, 'Object');
    },
    '/x/': function () {
        assert.equals(lewd(/x/).wrapped, 'Regex');
    },
    '"foo"': function () {
        assert.equals(lewd('foo').wrapped, 'Literal');
    },
    '42': function () {
        assert.equals(lewd(42).wrapped, 'Literal');
    },
    'false': function () {
        assert.equals(lewd(false).wrapped, 'Literal');
    },
    'Number, "foo", 42': function () {
        assert.equals(lewd(Number, 'foo', 42).wrapped, 'Some');
    },
    'existing condition': function () {
        var condition = new BooleanTypeCondition();
        assert.equals(lewd(condition).wrapped, 'BooleanType');
    }
});
