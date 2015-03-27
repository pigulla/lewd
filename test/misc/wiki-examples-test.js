'use strict';

var util = require('util');

var _ = require('lodash'),
    buster = require('buster');

var helper = require('../helper'),
    errorMessages = require('../../src/messages'),
    lewd = require('../../src/lewd');

var assert = buster.referee.assert,
    refute = buster.referee.refute,
    refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationAt = helper.assertViolationAt,
    assertViolationWithMessage = helper.assertViolationWithMessage;

buster.testCase('wiki examples', {
    'home': function () {
        var condition = lewd.array(lewd.some(lewd.all(String, /^x/), Boolean)),
            data = ['x1', 'x2', true, 'x3'];

        refute.exception(function () {
            condition(data);
        });

        data.push('4');
        assertViolationAt(function () {
            condition(data);
        }, [4]);
    },
    'coercion order': function () {
        var cond1 = lewd.all(lewd.unique, [lewd.integer().coerce()]),
            cond2 = lewd.all([lewd.integer().coerce()], lewd.unique);

        refute.exception(function () {
            cond1([42.13, 42]);
        });
        assertViolationAt(function () {
            cond2([42.13, 42]);
        }, [1]);
    },
    'removeExtra': function () {
        var condition = lewd.object({ a: Number, b: String }, { removeExtra: true }),
            data = { a: 1, b: '2', c: 3 };

        refute.exception(function () {
            condition(data);
        });
        assert.equals({ a: 1, b: '2' }, data);
    },
    'log messages': function () {
        var condition = lewd([{
                timestamp: lewd.isoDateTime(),
                level: lewd('verbose', 'info', 'warn', 'error'),
                message: String
            }]),
            data = [
                { 'timestamp': '2014-05-27T20:37:52.630Z', 'level': 'warn', 'message': 'Disk is full' },
                { 'timestamp': '2014-05-27T20:37:32.190Z', 'level': 'info', 'message': 'System is online' }
            ];

        refute.exception(function () {
            condition(data);
        });

        data.push({ timestamp: '2014-05-27T21:37:52.630Z', 'level': 'foo', 'message': 'hackz0rs' });
        assertViolationAt(function () {
            condition(data);
        }, [2, 'level']);
    },
    'address': function () {
        var condition = lewd.object({
                firstName: lewd.required(String),
                lastName: lewd.required(String),
                title: lewd('Mr', 'Mrs'),
                dob: lewd.isoDateTime().coerce(),
                city: String,
                zip: lewd.all(Number, lewd.range({ min: 1000, max: 99999 }))
            }, {
                byDefault: 'optional'
            }),
            data = {
                'firstName': 'Foo',
                'lastName': 'Bar',
                'title': 'Mr',
                'dob': '1977-06-25T00:00:00.000Z',
                'zip': 12345
            };

        refute.exception(function () {
            condition(data);
        });
        assert.equals(data.dob.getTime(), Date.parse('1977-06-25T00:00:00.000Z'));

        data.zip = 200;
        data.dob = '1977-06-25T00:00:00.000Z';
        assertViolationAt(function () {
            condition(data);
        }, ['zip']);
    },
    'book': function () {
        var positiveInt = lewd.all(lewd.integer(), lewd.range({ min: 1 })),
            chapter, book, data;

        chapter = lewd({
            title: String,
            pages: positiveInt,
            footnotes: lewd.optional([{
                id: positiveInt,
                text: String
            }])
        });
        book = lewd({
            title: String,
            price: lewd.optional(lewd.all(Number, lewd.range({ min: 0 }))),
            hasIndex: Boolean,
            chapters: lewd.all([chapter], lewd.len({ min: 3 }))
        });
        data = {
            'title': 'lewd for hackers',
            'hasIndex': true,
            'chapters': [
                {
                    'title': 'Introduction',
                    'pages': 4
                }, {
                    'title': 'First Steps',
                    'pages': 7,
                    'footnotes': [
                        { 'id': 1, 'text': '...' },
                        { 'id': 21, 'text': '...' }
                    ]
                }
            ]
        };

        assertViolationAt(function () {
            book(data);
        }, ['chapters']);

        data.chapters.push({ title: 'Conclusion', pages: 3 });
        refute.exception(function () {
            book(data);
        });
    },
    'custom coercion condition': function () {
        function MyCoercableCondition() {
            lewd.Condition.call(this, 'MyCoercableCondition');
            this.supportsCoercion = true;
        }

        util.inherits(MyCoercableCondition, lewd.Condition);

        MyCoercableCondition.prototype.validate = function (value, path) {
            if (typeof value === 'boolean') {
                return value;
            }

            if (typeof value === 'string' && this.isCoercionEnabled()) {
                if (value === 'true' || value === 'false') {
                    return value === 'true';
                }
            }

            this.reject(value, path, 'No can do, sir.');
        };

        var defaultCondition = (new MyCoercableCondition()).consumer(),
            coercingCondition = (new MyCoercableCondition()).consumer().coerce();

        helper.refuteValues(lewd.custom, [defaultCondition], [42, 'true', 0, null]);
        helper.acceptValues(lewd.custom, [defaultCondition], [true, false]);
        helper.refuteValues(lewd.custom, [coercingCondition], [42, 'TRUE', 0, null]);
        helper.acceptValues(lewd.custom, [coercingCondition],
            [true, false, 'true', 'false'], [true, false, true, false]);
    },
    'locking': function () {
        assert.exception(function () {
            var post = lewd({
                id: Number,
                text: String
            }).lock();

            post.allOptional();
        }, 'ConditionLockedException');
    },
    'default values in FAQ': function () {
        var condition = lewd({
            x: lewd(Array).optional().default([])
        });

        var value1 = condition({});
        value1.x.push(42);
        assert.equals(value1, { x: [42] });

        var value2 = condition({});
        assert.equals(value2, { x: [42] });
    }
});
