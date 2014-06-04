'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        buster: {
            tests: {
                test: {
                    config: 'test/buster.js'
                }
            },
            'tests-with-coverage': {
                test: {
                    config: 'test/buster-coverage.js'
                }
            }
        },
        clean: {
            reports: ['reports']
        },
        coverage: {
            options: {
                thresholds: {
                    statements: 97,
                    branches: 97,
                    lines: 97,
                    functions: 97
                },
                dir: '../reports/coverage',
                root: 'test'
            }
        },
        coveralls: {
            tests: {
                src: 'reports/coverage/lcov.info',
                force: true
            }
        },
        githooks: {
            dev: {
                'pre-push': 'prepush-check'
            }
        },
        jshint: {
            src: ['src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        plato: {
            source: {
                options : {
                    title: 'lewd Source Analysis',
                    recurse: true,
                    jshint : grunt.file.readJSON('.jshintrc')
                },
                files: {
                    'reports/plato': ['src']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-plato');
    
    grunt.registerTask('prepush-check', [
        'jshint', 'buster:tests-with-coverage', 'coverage'
    ]);
    grunt.registerTask('test', [
        'test-local', 'coveralls:tests'
    ]);
    grunt.registerTask('test-local', [
        'clean:reports', 'jshint', 'buster:tests-with-coverage', 'coverage', 'plato:source'
    ]);
    grunt.registerTask('default', ['test-local']);
};
