var _ = require('lodash'),
    buster = require('buster');

var lewd = require('../../src/lewd'),
    errorMessages = require('../../src/messages'),
    helper = require('../helper');

var refuteValues = helper.refuteValues,
    acceptValues = helper.acceptValues,
    assertViolationWithMessage = helper.assertViolationWithMessage,
    refuteSchemaOptions = helper.refuteSchemaOptions;

// These are just sanity checks. We don't want to re-test validator functionality.
buster.testCase('validator conditions', {
    'creditcard': {
        'values': function () {
            refuteValues(lewd.creditcard, [], [null, true, 32, 17.3, [], {}]);
            
            refuteValues(lewd.creditcard, [], ['foo', '5398228707871528']);
            acceptValues(lewd.creditcard, [], ['4716461583322103', '4716-2210-5188-5662', '4929 7226 5379 7141']);
        },
        'error message': {
            'type': function () {
                assertViolationWithMessage(function () {
                    lewd.creditcard()(null);
                }, _.template(errorMessages.Creditcard.type, {}));
            },
            'invalid': function () {
                assertViolationWithMessage(function () {
                    lewd.creditcard()('not an email');
                }, _.template(errorMessages.Creditcard.invalid, {}));
            }
        },
        'invalid schema options': function () {
            refuteSchemaOptions(lewd.creditcard, [2]);
        }
    },  
    'email': {
        'values': function () {
            refuteValues(lewd.email, [], [null, true, 32, 17.3, [], {}]);
            
            refuteValues(lewd.email, [], ['invalidemail@', 'invalid.com']);
            acceptValues(lewd.email, [], ['foo@bar.com', 'x@x.x', 'foo@bar.com.au']);
        },
        'error message': {
            'type': function () {
                assertViolationWithMessage(function () {
                    lewd.email()(null);
                }, _.template(errorMessages.Email.type, {}));
            },
            'invalid': function () {
                assertViolationWithMessage(function () {
                    lewd.email()('not an email');
                }, _.template(errorMessages.Email.invalid, {}));
            }
        },
        'invalid schema options': function () {
            refuteSchemaOptions(lewd.email, [2]);
        }
    },
    'ip': {
        'versions': function () {
            refuteValues(lewd.ip, [], [null, true, 32, 17.3, [], {}]);
            
            refuteValues(lewd.ip, [], ['256.0.0.0', '0.0.0.256']);
            acceptValues(lewd.ip, [], ['127.0.0.1', '0.0.0.0', '255.255.255.255']);
    
            refuteValues(lewd.ip, [4], ['::1', '2001:db8:0000:1:1:1:1:1']);
            refuteValues(lewd.ip, ['4'], ['::1', '2001:db8:0000:1:1:1:1:1']);
            acceptValues(lewd.ip, [4], ['127.0.0.1', '0.0.0.0']);
            acceptValues(lewd.ip, ['4'], ['127.0.0.1', '0.0.0.0']);
    
            refuteValues(lewd.ip, [6], ['127.0.0.1', '0.0.0.0']);
            refuteValues(lewd.ip, ['6'], ['127.0.0.1', '0.0.0.0']);
            acceptValues(lewd.ip, [6], ['::1', '2001:db8:0000:1:1:1:1:1']);
            acceptValues(lewd.ip, ['6'], ['::1', '2001:db8:0000:1:1:1:1:1']);
        },
        'error message': {
            'type': function () {
                assertViolationWithMessage(function () {
                    lewd.ip()(null);
                }, _.template(errorMessages.Ip.type, {}));
            },
            'invalid': function () {
                assertViolationWithMessage(function () {
                    lewd.ip()('not an ip');
                }, _.template(errorMessages.Ip.invalid, {}));
            }
        },
        'invalid schema options': function () {
            refuteSchemaOptions(lewd.ip, [2]);
        }
    },
    'isbn': {
        'versions': function () {
            refuteValues(lewd.isbn, [], [null, true, 32, 17.3, [], {}]);
            
            refuteValues(lewd.isbn, [], ['9783836221190']);
            acceptValues(lewd.isbn, [], ['9784873113685']);
    
            refuteValues(lewd.isbn, [10], ['978-3836221191']);
            refuteValues(lewd.isbn, ['10'], ['978-3836221191']);
            acceptValues(lewd.isbn, [10], ['3-401-01319-X']);
            acceptValues(lewd.isbn, ['10'], ['3-401-01319-X']);
    
            refuteValues(lewd.isbn, [13], ['3-8362-2119-5']);
            refuteValues(lewd.isbn, ['13'], ['3-8362-2119-5']);
            acceptValues(lewd.isbn, [13], ['978-4-87311-368-5']);
            acceptValues(lewd.isbn, ['13'], ['978-4-87311-368-5']);
        },
        'error message': {
            'type': function () {
                assertViolationWithMessage(function () {
                    lewd.isbn()(null);
                }, _.template(errorMessages.Isbn.type, {}));
            },
            'invalid': function () {
                assertViolationWithMessage(function () {
                    lewd.isbn()('not an isbn');
                }, _.template(errorMessages.Isbn.invalid, {}));
            }
        },
        'invalid schema options': function () {
            refuteSchemaOptions(lewd.isbn, [2]);
        }
    },
    'url': {
        'values': function () {
            refuteValues(lewd.url, [], [null, true, 17.3, 42, '', [], {}]);

            refuteValues(lewd.url, [], ['xyz://foobar.com', 'http://www.foobar.com:70000/']);
            acceptValues(lewd.url, [], ['http://user:pass@www.foobar.com/', 'valid.au']);
    
            refuteValues(lewd.url, [{ protocols: ['rtmp'] }], ['http://foobar.com']);
            acceptValues(lewd.url, [{ protocols: ['rtmp'] }], ['rtmp://foobar.com']);
        },
        'error message': {
            'type': function () {
                assertViolationWithMessage(function () {
                    lewd.url()(null);
                }, _.template(errorMessages.Url.type, {}));
            },
            'invalid': function () {
                assertViolationWithMessage(function () {
                    lewd.url()('not a url');
                }, _.template(errorMessages.Url.invalid, {}));
            }
        },
        'invalid schema options': function () {
            refuteSchemaOptions(lewd.url, [2]);
        }
    },
    'uuid': {
        'versions': function () {
            refuteValues(lewd.uuid, [], [null, true, 17.3, [], {}]);

            refuteValues(lewd.uuid, [], ['987FBC9-4BED-3078-CF07A-9141BA07C9F3']);
            acceptValues(lewd.uuid, [], ['A987FBC9-4BED-3078-CF07-9141BA07C9F3']);

            refuteValues(lewd.uuid, [3], ['AAAAAAAA-1111-1111-AAAG-111111111111']);
            refuteValues(lewd.uuid, ['3'], ['AAAAAAAA-1111-1111-AAAG-111111111111']);
            acceptValues(lewd.uuid, [3], ['A987FBC9-4BED-3078-CF07-9141BA07C9F3']);
            acceptValues(lewd.uuid, ['3'], ['A987FBC9-4BED-3078-CF07-9141BA07C9F3']);

            refuteValues(lewd.uuid, [4], ['A987FBC9-4BED-5078-AF07-9141BA07C9F3']);
            refuteValues(lewd.uuid, ['4'], ['A987FBC9-4BED-5078-AF07-9141BA07C9F3']);
            acceptValues(lewd.uuid, [4], ['57b73598-8764-4ad0-a76a-679bb6640eb1']);
            acceptValues(lewd.uuid, ['4'], ['57b73598-8764-4ad0-a76a-679bb6640eb1']);

            refuteValues(lewd.uuid, [5], ['9c858901-8a57-4791-81fe-4c455b099bc9']);
            refuteValues(lewd.uuid, ['5'], ['9c858901-8a57-4791-81fe-4c455b099bc9']);
            acceptValues(lewd.uuid, [5], ['987FBC97-4BED-5078-BF07-9141BA07C9F3']);
            acceptValues(lewd.uuid, ['5'], ['987FBC97-4BED-5078-BF07-9141BA07C9F3']);
        },
        'error message': {
            'type': function () {
                assertViolationWithMessage(function () {
                    lewd.uuid()(null);
                }, _.template(errorMessages.Uuid.type, {}));
            },
            'invalid': function () {
                assertViolationWithMessage(function () {
                    lewd.uuid()('not an uuid');
                }, _.template(errorMessages.Uuid.invalid, {}));
            }
        },
        'invalid schema options': function () {
            refuteSchemaOptions(lewd.uuid, [2]);
        }
    }
});
