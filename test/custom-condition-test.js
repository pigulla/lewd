var buster = require('buster');

var lewd = require('../src/lewd'),
    ConditionViolationException = require('../src/exception/ConditionViolationException');

buster.testCase('custom condition', {
    'without custom message': function () {
        function oddNumberCondition(value, path) {
            path = path || [];
            
            if ((value % 2) !== 1) {
                throw new ConditionViolationException(value, path, 'number is not odd');
            }
        }
        
        try {
            lewd(oddNumberCondition)(4);
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.match(e.message, 'number is not odd');
            return;
        }

        buster.referee.assert(false, 'An exception should should have been thrown');
    },
    'with custom message': function () {
        function oddNumberCondition(value, path) {
            path = path || [];
            
            if ((value % 2) !== 1) {
                throw new ConditionViolationException(value, path, 'number is not odd');
            }
        }
        
        try {
            lewd(oddNumberCondition).because('i say so')(4);
        } catch (e) {
            buster.referee.assert.equals(e.name, 'ConditionViolationException');
            buster.referee.assert.equals(e.message, 'i say so');
            return;
        }

        buster.referee.assert(false, 'An exception should should have been thrown');
    }
});
