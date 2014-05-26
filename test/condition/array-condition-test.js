var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

var condition = lewd.Array;

buster.testCase('arrays', {
    'simple': {
        '[]': function () {
            var args = [];

            refuteValues(condition, args, ['', 'blub', 0, 42, 17.3, null, true, false, {}]);
            acceptValues(condition, args, [
                [], [''], ['blub'], [0], [42], [17.3], [[]], [['19']], [null], [true], [false], [{}]
            ]);
        },
        '[undefined]': function () {
            var args = [undefined];

            refuteValues(condition, args, ['', 'blub', 0, 42, 17.3, null, true, false, {}]);
            acceptValues(condition, args, [
                [], [''], ['blub'], [0], [42], [17.3], [[]], [['19']], [null], [true], [false], [{}]
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
        '[String, Number]': function () {
            var args = [String, Number];

            refuteValues(condition, args, [42, {}, [true], [42, '42', null]]);
            acceptValues(condition, args, [[], ['42', 'hello'], [42, 13], ['one', 2, 3]]);
        },
        '[Boolean, /^\\d/]': function () {
            var args = [Boolean, /^\d/];

            refuteValues(condition, args, [42, {}, [null], [42, '42', null], ['x', true], [1, -3]]);
            acceptValues(condition, args, [[], ['42', false], [true, false], [42, 13], ['1xx', 2, true]]);
        },
        '[[]]': function () {
            var args = [[]];

            refuteValues(condition, args, [42, null, 'blub', {}, [42], [null], ['blub'], [{}]]);
            acceptValues(condition, args, [
                [], [[]], [['42'], [false]], [[], []], [[true, false]], [[42, {}]], [['1xx'], [2, true]]
            ]);
        },    
        '[Array]': function () {
            var args = [Array];

            refuteValues(condition, args, [42, null, 'blub', {}, [42], [null], ['blub'], [{}]]);
            acceptValues(condition, args, [
                [], [[]], [['42'], [false]], [[], []], [[true, false]], [[42, {}]], [['1xx'], [2, true]]
            ]);
        },
        '[[undefined]]': function () {
            var args = [[undefined]];

            refuteValues(condition, args, [42, null, 'blub', {}, [42], [null], ['blub'], [{}]]);
            acceptValues(condition, args, [
                [], [[]], [['42'], [false]], [[], []], [[true, false]], [[42, {}]], [['1xx'], [2, true]]
            ]);
        }
    }
});
