module.exports = {
    'Array': 'must be an array',
    'Integer': 'must be an integer',
    'IsoDateTime': 'not a valid ISO 8601 datetime string',
    'Len': {
        'max': 'must not be longer than ${max}',
        'min': 'must not be shorter than ${min}',
        'type': 'must be a string or array'
    },
    'Literal': 'must be equal to ${valueStr}',
    'None': 'must not satisfy any of the given conditions',
    'Not': 'must not satisfy the condition',
    'Object': {
        'type': 'must be an object',
        'unexpectedKey': 'key "${key}" was not expected',
        'missingKey': 'key "${key}" is required'
    },
    'Range': {
        'max': 'must not be greater than ${max}',
        'min': 'must not be smaller than ${min}'
    },
    'Regex': 'must match the regular expression',
    'Some': 'did not satisfy any of the given conditions',
    'Type': 'must be of type ${type}'
};
