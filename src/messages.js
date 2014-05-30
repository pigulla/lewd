module.exports = {
    'Array': 'must be an array',
    'Custom': 'custom condition failed',
    'Integer': 'must be an integer',
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
    'Range': {
        'max': 'must not be greater than ${max}',
        'maxInclusive': 'must not be greater than or equal to ${max}',
        'min': 'must not be smaller than ${min}',
        'minInclusive': 'must not be smaller than or equal to ${min}'
    },
    'Regex': 'must match the regular expression',
    'Some': 'did not satisfy any of the given conditions',
    'Type': 'must be of type ${type}'
};
