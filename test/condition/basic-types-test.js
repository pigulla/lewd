'use strict';

var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('./../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage;

buster.testCase('basic types', {
    'Boolean': function () {
        refuteValues(lewd.Boolean, [], ['', 'foo', 0, 42, 17.3, [], ['19'], null, {}]);
        acceptValues(lewd.Boolean, [], [true, false]);
    },
    'Number': function () {
        refuteValues(lewd.Number, [], ['', 'foo', [], ['19'], null, true, false, {}]);
        acceptValues(lewd.Number, [], [0, 14, -3.1415]);
    },
    'String': function () {
        refuteValues(lewd.String, [], [0, 42, 17.3, [], ['19'], null, true, false, {}]);
        acceptValues(lewd.String, [], ['', 'foo', '0']);
    },
    'Object': function () {
        refuteValues(lewd.Object, [], [0, 42, 17.3, '', 'foo', [], ['19'], null, true, false]);
        acceptValues(lewd.Object, [], [new (function () {})(), Object.create(function () {})]);
        acceptValues(lewd.Object, [], [{}, { x: 42 }]);
    },
    'null': function () {
        refuteValues(lewd.null, [], ['', 'foo', 0, 42, 17.3, [], ['19'], true, false, {}]);
        acceptValues(lewd.null, [], [null]);
    },
    'Array': function () {
        refuteValues(lewd.Array, [], ['', 'foo', 0, 42, 17.3, true, false, {}]);
        acceptValues(lewd.Array, [], [[], [null], [1, 2, 3]]);
    },
    'undefined': function () {
        acceptValues(lewd.undefined, [], ['', 'foo', 0, 42, 17.3, [], ['19'], null, true, false, {}]);
    },
    'error messages': {
        'Boolean': function () {
            assertViolationWithMessage(function () {
                lewd.Boolean()('foo');
            }, _.template(errorMessages.Type)({ type: 'boolean' }));
        },
        'Number': function () {
            assertViolationWithMessage(function () {
                lewd.Number()('foo');
            }, _.template(errorMessages.Type)({ type: 'number' }));
        },
        'String': function () {
            assertViolationWithMessage(function () {
                lewd.String()(42);
            }, _.template(errorMessages.Type)({ type: 'string' }));
        },
        'Object': function () {
            assertViolationWithMessage(function () {
                lewd.Object()('foo');
            }, _.template(errorMessages.Type)({ type: 'object' }));
        },
        'null': function () {
            assertViolationWithMessage(function () {
                lewd.null()('foo');
            }, _.template(errorMessages.Type)({ type: 'null' }));
        },
        'Array': function () {
            assertViolationWithMessage(function () {
                lewd.Array()('foo');
            }, _.template(errorMessages.Type)({ type: 'array' }));
        }
    }
});
