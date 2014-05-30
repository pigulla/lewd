'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        buster: {
            tests: {
                test: {
                    config: 'test/buster.js'
                }
            }
        },
        clean: {
            coverage: ['test/coverage']
        },
        coverage: {
            options: {
                thresholds: {
                    statements: 97,
                    branches: 97,
                    lines: 97,
                    functions: 97
                },
                dir: 'coverage',
                root: 'test'
            }
        },
        coveralls: {
            tests: {
                src: 'test/coverage/lcov.info',
                force: false
            }
        },
        jshint: {
            src: ['src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    
    grunt.registerTask('test', ['jshint', 'clean:coverage', 'buster:tests', 'coverage', 'coveralls:tests']);
    grunt.registerTask('test-local', ['jshint', 'clean:coverage', 'buster:tests', 'coverage']);
    grunt.registerTask('default', ['test-local']);
};
