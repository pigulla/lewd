var buster = require('buster');

var lewd = require('../src/lewd'),
    errorMessages = require('../src/messages'),
    ConditionViolationException = require('../src/exception/ConditionViolationException');

function oddNumberConditionWithException(value, path) {
    if ((value % 2) !== 1) {
        throw new ConditionViolationException(value, path, 'number is not odd');
    }
}
function oddNumberConditionWithReturnString(value) {
    if ((value % 2) !== 1) {
        return 'number is not odd';
    }
}
function oddNumberConditionWithReturnFalse(value) {
    return (value % 2) === 1;
}

buster.testCase('custom condition', {
    'without custom message': function () {
        try {
            lewd(oddNumberConditionWithException)(4);
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.match(e.message, 'number is not odd');
            return;
        }

        buster.referee.assert(false, 'An exception should have been thrown');
    },
    'with custom message': function () {
        try {
            lewd(oddNumberConditionWithException).because('i say so')(4);
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.equals(e.message, 'i say so');
            return;
        }

        buster.referee.assert(false, 'An exception should have been thrown');
    },
    'report the correct path': function () {
        try {
            lewd({ x: [lewd(oddNumberConditionWithException)] })({ x: [1, 2] });
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.equals(e.path, ['x', '#1']);
            buster.referee.assert.equals(e.message, 'number is not odd');
            return;
        }

        buster.referee.assert(false, 'An exception should have been thrown');
    },
    'simplified inline condition': {
        'nested with exception': function () {
            var inlineCondition = function (value) { return value > 5;},
                condition = lewd({ a: [Number, inlineCondition] });
    
            try {
                condition({ a: [42, 13.2, -7, 9] });
            } catch (e) {
                buster.referee.assert.equals(e.name, 'ConditionViolationException');
                buster.referee.assert.equals(e.path, ['a', '#2']);
                buster.referee.assert.equals(e.message, errorMessages.Custom);
                return;
            }
    
            buster.referee.assert(false, 'An exception should have been thrown');
        },
        'nested with return false': function () {
            var condition = lewd({ a: [Number, oddNumberConditionWithReturnFalse] });
    
            try {
                condition({ a: [41, 12, -7] });
            } catch (e) {
                buster.referee.assert.equals(e.name, 'ConditionViolationException');
                buster.referee.assert.equals(e.path, ['a', '#1']);
                buster.referee.assert.equals(e.message, errorMessages.Custom);
                return;
            }
    
            buster.referee.assert(false, 'An exception should have been thrown');
        },
        'nested with return false and custom error': function () {
            var condition = lewd({ a: [Number, lewd(oddNumberConditionWithReturnFalse).because('i say so')] });
    
            try {
                condition({ a: [41, 12, -7] });
            } catch (e) {
                buster.referee.assert.equals(e.name, 'ConditionViolationException');
                buster.referee.assert.equals(e.path, ['a', '#1']);
                buster.referee.assert.equals(e.message, 'i say so');
                return;
            }
    
            buster.referee.assert(false, 'An exception should have been thrown');
        },
        'nested with returned string': function () {
            var condition = lewd({ a: [Number, oddNumberConditionWithReturnString] });
    
            try {
                condition({ a: [41, 12, -7] });
            } catch (e) {
                buster.referee.assert.equals(e.name, 'ConditionViolationException');
                buster.referee.assert.equals(e.path, ['a', '#1']);
                buster.referee.assert.equals(e.message, 'number is not odd');
                return;
            }
    
            buster.referee.assert(false, 'An exception should have been thrown');
        }
    }
});
