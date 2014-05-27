var _ = require('lodash'),
    buster = require('buster');

var helper = require('./helper'),
    errorMessages = require('../src/messages'),
    lewd = require('../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationAt = helper.assertViolationAt,
    assertViolationWithMessage = helper.assertViolationWithMessage;

buster.testCase('shorthand syntax', {
    'Boolean': function () {
        buster.referee.assert.equals(lewd(Boolean)._wrapped, 'booleanTypeCondition');
    },
    'Array': function () {
        buster.referee.assert.equals(lewd(Array)._wrapped, 'arrayTypeCondition');
    },
    'Object': function () {
        buster.referee.assert.equals(lewd(Object)._wrapped, 'objectTypeCondition');
    },
    'String': function () {
        buster.referee.assert.equals(lewd(String)._wrapped, 'stringTypeCondition');
    },
    'Number': function () {
        buster.referee.assert.equals(lewd(Number)._wrapped, 'numberTypeCondition');
    },
    'null': function () {
        buster.referee.assert.equals(lewd(null)._wrapped, 'nullTypeCondition');
    },
    'undefined': function () {
        var x = lewd(undefined);
        buster.referee.assert.equals(lewd(undefined)._wrapped, 'anyCondition');
    },
    '[1, 2, 3]': function () {
        buster.referee.assert.equals(lewd([1, 2, 3])._wrapped, 'arrayCondition');
    },
    '{}': function () {
        buster.referee.assert.equals(lewd({})._wrapped, 'objectCondition');
    },
    '/x/': function () {
        buster.referee.assert.equals(lewd(/x/)._wrapped, 'regexCondition');
    },
    '"foo"': function () {
        buster.referee.assert.equals(lewd('foo')._wrapped, 'literalCondition');
    },
    '42': function () {
        buster.referee.assert.equals(lewd(42)._wrapped, 'literalCondition');
    },
    'false': function () {
        buster.referee.assert.equals(lewd(false)._wrapped, 'literalCondition');
    },
    'Number, "foo", 42': function () {
        buster.referee.assert.equals(lewd(Number, 'foo', 42)._wrapped, 'someCondition');
    }
});
