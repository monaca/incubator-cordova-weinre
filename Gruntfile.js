const grunt = require('grunt');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        cssmin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'weinre.web-src',
                    src: ['*/**.css'],
                    dest: 'weinre.web'
                },{
                    expand: true,
                    cwd: 'weinre.build-src',
                    src: ['*/**.css'],
                    dest: 'weinre.build'
                }]
            }
        },
        uglify: {
            prod: {
                options: {
                    output: {
                        comments: 'all'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'weinre.web-src',
                    src: '**/*.js',
                    dest: 'weinre.web'
                },{
                    expand: true,
                    cwd: 'weinre.build-src',
                    src: ['**/*.js', '!node_modules/**', '!**/*.lproj/**'],
                    dest: 'weinre.build'
                }]
            }
        }
    });

    grunt.registerTask('default', ['cssmin', 'uglify']);
};
