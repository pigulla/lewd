module.exports = {
    'Array': 'must be an array',
    'Custom': 'custom condition failed',
    'Integer': 'must be an integer',
    'Email': {
        'type': 'must be a string',
        'invalid': 'not a valid email'
    },  
    'Creditcard': {
        'type': 'must be a string',
        'invalid': 'not a valid credit card number'
    },  
    'Isbn': {
        'type': 'must be a string',
        'invalid': 'not a valid ISBN'
    },
    'Ip': {
        'type': 'must be a string',
        'invalid': 'not a valid IP'
    },
    'IsoDateTime': 'not a valid ISO 8601 datetime string',
    'Len': {
        'max': 'must not be longer than ${max}',
        'maxInclusive': 'must not be longer than or equal to ${max}',
        'min': 'must not be shorter than ${min}',
        'minInclusive': 'must not be shorter than or equal to ${min}',
        'type': 'must be a string or array'
    },
    'Literal': 'must be equal to ${literalStr}',
    'None': 'must not satisfy any of the given conditions',
    'Not': 'must not satisfy the condition',
    'Object': {
        'type': 'must be an object',
        'unexpectedKey': 'key "${key}" was not expected',
        'missingKey': 'key "${key}" is required'
    },
    'PasswordStrength': {
        'type': 'must be a string',
        'test': {
            0: 'Test 0 failed',
            1: 'Test 1 failed',
            2: 'Test 2 failed',
            3: 'Test 3 failed',
            4: 'Test 4 failed',
            5: 'Test 5 failed',
            6: 'Test 6 failed'
        }
    },
    'Range': {
        'max': 'must not be greater than ${max}',
        'maxInclusive': 'must not be greater than or equal to ${max}',
        'min': 'must not be smaller than ${min}',
        'minInclusive': 'must not be smaller than or equal to ${min}'
    },
    'Regex': 'must match the regular expression ${regex}',
    'Some': 'did not satisfy any of the given conditions',
    'Type': 'must be of type ${type}',
    'Unique': {
        'type': 'must be an array', 
        'duplicateFound': 'values must be unique'
    },
    'Url': {
        'type': 'must be a string',
        'invalid': 'not a valid URL'
    },
    'Uuid': {
        'type': 'must be a string',
        'invalid': 'not a valid UUID'
    }
};
