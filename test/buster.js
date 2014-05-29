module.exports.lewd = {
    rootPath: '..',
    environment: 'node',
    sources: ['src/**/*.js'],
    tests: ['test/**/*-test.js'],
    'buster-istanbul': {
        outputDirectory: 'test/coverage',
        format: 'json'
    },
    extensions: [
        require('buster-istanbul')
    ]
};
