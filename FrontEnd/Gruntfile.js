/**
 * Created by Anca on 22.04.2015.
 */
'use strict';

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        watch: {
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    '{,*/}*.html',
                    '*/{,*/}*.html',
                    '{,*/}*.js',
                    '{,*/}*.css',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp/,}scripts/{,*/}*.js',
                    'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            proxies: [

            ],
            options: {
                port: 9000,
                // Change this to 'localhost' to deny access to the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        ''
                    ],
                    middleware: function (connect) {
                        return [
                            proxySnippet,
                            connect.static(require('path').resolve(''))
                        ];
                    }
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });
};