var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.array;

buster.testCase('"array" condition', {
    'simple': {
        '[]': function () {
            var args = [];

            refuteValues(condition, args, ['', 'foo', 0, 42, 17.3, null, true, false, {}]);
            acceptValues(condition, args, [
                [], [''], ['foo'], [0], [42], [17.3], [[]], [['19']], [null], [true], [false], [{}]
            ]);
        },
        '[undefined]': function () {
            var args = [undefined];

            refuteValues(condition, args, ['', 'foo', 0, 42, 17.3, null, true, false, {}]);
            acceptValues(condition, args, [
                [], [''], ['foo'], [0], [42], [17.3], [[]], [['19']], [null], [true], [false], [{}]
            ]);
        },
        '[String]': function () {
            var args = [String];
    
            refuteValues(condition, args, [42, {}, [42], [42, '42']]);
            acceptValues(condition, args, [[], ['42', 'hello']]);
        },
        '[Number]': function () {
            var args = [Number];
    
            refuteValues(condition, args, ['42', {}, ['42'], [42, '42']]);
            acceptValues(condition, args, [[], [42, 13]]);
        },
        '[Boolean]': function () {
            var args = [Boolean];
    
            refuteValues(condition, args, [0, null, '42', {}, false, [true, 1]]);
            acceptValues(condition, args, [[], [true], [false, false]]);
        },
        '[Object]': function () {
            var args = [Object];
    
            refuteValues(condition, args, ['42', {}, false, null, 0, [true, 1], [null], [[]], [false]]);
            acceptValues(condition, args, [[], [{}], [{ x: 42 }], [{}, { y: null }]]);
        },
        '[null]': function () {
            var args = [null];
    
            refuteValues(condition, args, ['42', {}, false, [true, 1], ['hey'], [0]]);
            acceptValues(condition, args, [[], [null], [null, null]]);
        }
    },
    'complex': {
        '[String, /^\\d+$/]': function () {
            var args = [String, /^\d+$/];

            refuteValues(condition, args, [42, {}, [true], [42, '42', null], ['42', '19', 4], [19]]);
            acceptValues(condition, args, [[], ['42', '13'], ['42']]);
        },
        '[Number, /^\\d+$/]': function () {
            var args = [Number, /^\d+$/];

            refuteValues(condition, args, [42, {}, [null], [42, '42'], ['x', true], [1, -3], [42, '3'], [42, 1.2]]);
            acceptValues(condition, args, [[], [42, 14], [99.0, 14]]);
        },
        '[[]]': function () {
            var args = [[]];

            refuteValues(condition, args, [42, null, 'foo', {}, [42], [null], ['foo'], [{}]]);
            acceptValues(condition, args, [
                [], [[]], [['42'], [false]], [[], []], [[true, false]], [[42, {}]], [['1xx'], [2, true]]
            ]);
        },    
        '[Array]': function () {
            var args = [Array];

            refuteValues(condition, args, [42, null, 'foo', {}, [42], [null], ['foo'], [{}]]);
            acceptValues(condition, args, [
                [], [[]], [['42'], [false]], [[], []], [[true, false]], [[42, {}]], [['1xx'], [2, true]]
            ]);
        },
        '[[undefined]]': function () {
            var args = [[undefined]];

            refuteValues(condition, args, [42, null, 'foo', {}, [42], [null], ['foo'], [{}]]);
            acceptValues(condition, args, [
                [], [[]], [['42'], [false]], [[], []], [[true, false]], [[42, {}]], [['1xx'], [2, true]]
            ]);
        }
    },
    'passes exceptions through': function () {
        buster.referee.assert.exception(function () {
            condition(function () { x(); })(['x']);  // jshint ignore:line                
        }, 'ReferenceError');
    },
    'error message': function () {
        assertViolationWithMessage(function () {
            condition()('foo');
        }, _.template(errorMessages.Array, {}));
    }
});
