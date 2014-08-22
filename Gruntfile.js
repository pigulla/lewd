'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'dist/lewd.js': ['src/lewd.js']
                },
                options: {
                    bundleOptions: {
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
        githooks: {
            dev: {
                'pre-push': 'prepush-check'
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
    
    grunt.registerTask('build', ['browserify:dist', 'uglify:dist']);

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-plato');
    
    grunt.registerTask('prepush-check', [
        'jscs', 'jshint', 'buster:tests-with-coverage', 'coverage'
    ]);
    grunt.registerTask('test', [
        'test-local', 'coveralls:tests'
    ]);
    grunt.registerTask('test-local', [
        'clean:reports', 'jscs', 'jshint', 'buster:tests-with-coverage', 'coverage', 'plato:source'
    ]);
    grunt.registerTask('default', ['test-local']);
};
