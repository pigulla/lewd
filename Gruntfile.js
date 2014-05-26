'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: {
                src: ['**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        buster: {
            tests: {
                test: {
                    config: 'test/buster.js',
                    verbose: true,
                    reporter: 'specification'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
