var _ = require('lodash'),
    buster = require('buster');

var helper = require('../helper'),
    errorMessages = require('../../src/messages'),
    lewd = require('../../src/lewd');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationAt = helper.assertViolationAt,
    assertViolationWithMessage = helper.assertViolationWithMessage;

var condition = lewd.object;

buster.testCase('complex validations', {
    'book': function () {
        var condition = lewd.object({
            title: lewd.all(String, lewd.len({ min: 1, max: 10 })),
            author: lewd.optional({ firstName: String, lastName: String }),
            chapters: lewd.all([{
                name: String,
                inProgress: lewd.optional(Boolean).default(false),
                references: lewd.optional(lewd.all([lewd.integer], lewd.unique)),
                pages: lewd.all(lewd.integer, lewd.range({ min: 1 }))
            }], lewd.len({ min: 3 }).because('a book needs at least three chapters (where: ${path})'))
        });
        
        buster.referee.refute.exception(function () {
            var result = condition({
                title: 'My Book',
                chapters: [
                    { name: 'Chapter 1', pages: 4 },
                    { name: 'Chapter 2', pages: 2, inProgress: true },
                    { name: 'Chapter 3', pages: 11 }
                ]
            });
            
            buster.referee.assert.same(result.chapters[0].inProgress, false);
            buster.referee.assert.same(result.chapters[1].inProgress, true);
            buster.referee.assert.same(result.chapters[2].inProgress, false);
        });

        assertViolationAt(function () {
            condition({
                title: 'My Book With A Way Too Long Title',
                chapters: []
            });
        }, ['title']);
        
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
        
        assertViolationAt(function () {
            condition({
                title: 'My Book',
                chapters: [
                    { name: 'Chapter 1', pages: 4, references: [] },
                    { name: 'Chapter 2', pages: 2 },
                    { name: 'Chapter 3', pages: 3, references: [1, 2, 1] }
                ]
            });
        }, ['chapters', '#2', 'references', '#2']);

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
