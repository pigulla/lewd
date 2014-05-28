'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: {
                src: ['src/**/*.js', 'test/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        buster: {
            tests: {
                test: {
                    config: 'test/buster.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('default', ['jshint:all', 'buster:tests']);
};
