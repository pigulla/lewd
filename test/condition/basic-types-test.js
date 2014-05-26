var buster = require('buster');

var lewd = require('../../src/lewd'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues;

buster.testCase('basic types', {
    'Boolean': function () {
        refuteValues(lewd.Boolean, [], ['', 'blub', 0, 42, 17.3, [], ['19'], null, {}]);
        acceptValues(lewd.Boolean, [], [true, false]);        
    },
    'Number': function () {
        refuteValues(lewd.Number, [], ['', 'blub', [], ['19'], null, true, false, {}]);
        acceptValues(lewd.Number, [], [0, 14, -3.1415]);
    },
    'String': function () {
        refuteValues(lewd.String, [], [0, 42, 17.3, [], ['19'], null, true, false, {}]);
        acceptValues(lewd.String, [], ['', 'blub', '0']);
    }, 
    'Object': function () {
        refuteValues(lewd.Object, [], [0, 42, 17.3, '', 'blub', [], ['19'], null, true, false]);
        acceptValues(lewd.Object, [], [{}, { x: 42 }]);
    },
    'null': function () {
        refuteValues(lewd.null, [], ['', 'blub', 0, 42, 17.3, [], ['19'], true, false, {}]);
        acceptValues(lewd.null, [], [null]);
    },
    'undefined': function () {
        acceptValues(lewd.undefined, [], ['', 'blub', 0, 42, 17.3, [], ['19'], null, true, false, {}]);
    }
});
