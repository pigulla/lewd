var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

buster.testCase('validator conditions', {
    'uuid': function () {
        refuteValues(lewd.uuid, [], [
            '', '42', true, [], null, {}, 'bcd', '1a', 'A', 14.3, -0.001,
            'da77ee54-ecd4-11e3-a98e-82687f4fc15cx',
            'da77f142-ecd4-11e3-a98e-82687f4fc15',
            '1e0684a6-ec25-4c8c-9929-6f2b1fd50591'
        ]);
        acceptValues(lewd.uuid, [], [
            'da77ee54-ecd4-11e3-a98e-82687f4fc15c',
            'da77f142-ecd4-11e3-a98e-1234567890ab'
        ]);

        refuteValues(lewd.uuid, [4], [
            '', '42', true, [], null, {}, 'bcd', '1a', 'A', 14.3, -0.001,
            'da77ee54-ecd4-11e3-a98e-82687f4fc15c',
            '1e0684a6-ec25-4c8c-9929-6f2b1fd50591x',
            '1e0684a6-ec25-4c8c-9929-6f2b1fd5059'
        ]);
        acceptValues(lewd.uuid, [4], [
            '1e0684a6-ec25-4c8c-9929-6f2b1fd50591',
            'e1d17aa0-2255-4efa-871f-1d3fe5e0093a'
        ]);
    }
});
