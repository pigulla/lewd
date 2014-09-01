'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'dist/lewd.js': ['src/lewd.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'lewd'
                    }
                }
            }
        },
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
                    statements: 100,
                    branches: 100,
                    lines: 100,
                    functions: 100
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
        jscs: {
            source: {
                src: ['src/**/*.js'],
                options: {
                    config: '.jscsrc'
                }
            },
            tests: {
                src: ['test/**/*.js'],
                options: {
                    config: '.jscsrc'
                }
            }
        },
        jshint: {
            src: ['src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        shell: {
            'check-version-strings': {
                command: '! grep -n -r -i -- "-DEV" src/* package.json CHANGELOG.md',
                options: {
                    failOnError: true,
                    stderr: false,
                    stdout: true
                }
            },
            'nsp': {
                command: [
                    'npm shrinkwrap',
                    'node_modules/nsp/bin/nspCLI.js audit-shrinkwrap'
                ].join('&&'),
                options: {
                    failOnError: true,
                    stderr: false,
                    stdout: true
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/lewd.min.js': ['dist/lewd.js']
                },
                options: {
                    mangle: true,
                    compress: true,
                    report: 'min'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('nsp-audit', [
        'shell:nsp'
    ]);
    grunt.registerTask('dist', [
        'browserify:dist', 'uglify:dist'
    ]);
    grunt.registerTask('prepush-check', [
        'jscs', 'jshint', 'buster:tests-with-coverage', 'coverage'
    ]);
    grunt.registerTask('test', [
        'clean:reports', 'jscs', 'jshint', 'buster:tests-with-coverage', 'coverage', 'nsp-audit'
    ]);
    grunt.registerTask('test-prerelease', [
        'test', 'check-version-strings'
    ]);

    grunt.registerTask('default', ['test']);
};
