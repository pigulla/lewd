var _ = require('lodash'),
    buster = require('buster');

var helper = require('./helper'),
    errorMessages = require('../src/messages'),
    lewd = require('../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationAt = helper.assertViolationAt,
    assertViolationWithMessage = helper.assertViolationWithMessage;

buster.testCase('wiki examples', {
    'home': function () {
        var condition = lewd.array(lewd.some(lewd.all(String, /^x/), Boolean)),
            data = ['x1', 'x2', true, 'x3'];

        buster.referee.refute.exception(function () {
            condition(data);
        });

        data.push('4');
        assertViolationAt(function () {
            condition(data);
        }, ['#4']);
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
        
        buster.referee.refute.exception(function () {
            condition(data);
        });
        
        data.push({ timestamp: '2014-05-27T21:37:52.630Z', 'level': 'foo', 'message': 'hackz0rs'});
        assertViolationAt(function () {
            condition(data);
        }, ['#2', 'level']);
    },
    'address': function () {
        var condition = lewd.object({
                firstName: lewd.required(String),
                lastName: lewd.required(String),
                title: lewd('Mr', 'Mrs'),
                dob: lewd.isoDateTime(),
                city: String,
                zip: lewd.all(Number, lewd.range({ min: 1000, max: 99999 }))
            }, {
                byDefault: 'optional'
            }),
            data = {
                'firstName': 'Foo',
                'lastName': 'Bar',
                'title': 'Mr',
                'zip': 12345
            };

        buster.referee.refute.exception(function () {
            condition(data);
        });
        data.zip = 200;
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
        buster.referee.refute.exception(function () {
            book(data);
        });
    }
});
