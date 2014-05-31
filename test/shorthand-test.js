var _ = require('lodash'),
    buster = require('buster');

var helper = require('./helper'),
    errorMessages = require('../src/messages'),
    lewd = require('../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

buster.testCase('shorthand syntax', {
    'Boolean': function () {
        buster.referee.assert.equals(lewd(Boolean).wrapped, 'BooleanType');
    },
    'Array': function () {
        buster.referee.assert.equals(lewd(Array).wrapped, 'ArrayType');
    },
    'Object': function () {
        buster.referee.assert.equals(lewd(Object).wrapped, 'ObjectType');
    },
    'String': function () {
        buster.referee.assert.equals(lewd(String).wrapped, 'StringType');
    },
    'Number': function () {
        buster.referee.assert.equals(lewd(Number).wrapped, 'NumberType');
    },
    'null': function () {
        buster.referee.assert.equals(lewd(null).wrapped, 'NullType');
    },
    'undefined': function () {
        var x = lewd(undefined);
        buster.referee.assert.equals(lewd(undefined).wrapped, 'Any');
    },
    '[1, 2, 3]': function () {
        buster.referee.assert.equals(lewd([1, 2, 3]).wrapped, 'Array');
    },
    '{}': function () {
        buster.referee.assert.equals(lewd({}).wrapped, 'Object');
    },
    '/x/': function () {
        buster.referee.assert.equals(lewd(/x/).wrapped, 'Regex');
    },
    '"foo"': function () {
        buster.referee.assert.equals(lewd('foo').wrapped, 'Literal');
    },
    '42': function () {
        buster.referee.assert.equals(lewd(42).wrapped, 'Literal');
    },
    'false': function () {
        buster.referee.assert.equals(lewd(false).wrapped, 'Literal');
    },
    'Number, "foo", 42': function () {
        buster.referee.assert.equals(lewd(Number, 'foo', 42).wrapped, 'Some');
    }
});
