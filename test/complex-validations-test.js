var _ = require('lodash'),
    buster = require('buster');

var helper = require('./helper'),
    errorMessages = require('../src/messages'),
    lewd = require('../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationAt = helper.assertViolationAt,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.object;

buster.testCase('complex validations', {
    'book': function () {
        var condition = lewd.object({
            title: lewd.all(String, lewd.len({ min: 1, max: 10 })),
            author: { firstName: String, lastName: String },
            chapters: lewd.all([{
                name: String,
                pages: lewd.all(lewd.integer(), lewd.range({ min: 1 }))
            }], lewd.len({ min: 3 }).because('a book needs at least three chapters (where: ${path})'))
        }, { optional: ['author']});
        
        buster.referee.refute.exception(function () {
            condition({
                title: 'My Book',
                chapters: [
                    { name: 'Chapter 1', pages: 4 },
                    { name: 'Chapter 2', pages: 2 },
                    { name: 'Chapter 3', pages: 11 },
                ]
            });
        });

        assertViolationAt(function () {
            condition({
                title: 'My Book',
                publisher: 'AwesomeBooks, Inc.',
                chapters: []
            });
        }, []);

        assertViolationAt(function () {
            condition({
                title: 'My Book',
                chapters: []
            });
        }, ['chapters']);

        assertViolationAt(function () {
            condition({
                title: 'My Book',
                chapters: [
                    { name: 'Chapter 1', pages: 4 },
                    { name: 'Chapter 2', pages: 2, rating: 'very good' },
                    { name: 'Chapter 3', pages: 11 }
                ]
            });
        }, ['chapters', '#1']);

        assertViolationAt(function () {
            condition({
                title: 'My Book',
                chapters: [
                    { name: 'Chapter 1', pages: 4 },
                    { name: 'Chapter 2', pages: 2 },
                    { name: 'Chapter 3', pages: 0 }
                ]
            });
        }, ['chapters', '#2', 'pages']);

        assertViolationWithMessage(function () {
            condition({
                title: 'My Book',
                chapters: [
                    { name: 'Chapter 1', pages: 4 },
                    { name: 'Chapter 2', pages: 2 }
                ]
            });
        }, 'a book needs at least three chapters (where: chapters)');
    }
});
