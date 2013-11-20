/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*\n' + ' * <%= pkg.title || pkg.name %> v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * \n * <%= pkg.description %> * \n'  + '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' + ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' + ' */'
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', 'src/promise.js', '<file_strip_banner:src/<%= pkg.name %>.js>'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        qunit: {
            files: ['test/*.html']
        },
        phantomjs: {
            timeout: 20000
        },		
        uglify: {
            files: ['src/**/*.js']
        },
        watch: {
            files: '<config:uglify.files>',
            tasks: 'uglify qunit'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
		evil: true
            },
            globals: {
                Promise: true,
		Task: true,
		postMessage: true
            }
        }
    });

    //load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', ['jshint','qunit','concat','uglify']);

    // Travis CI task.
    grunt.registerTask('travis', ['jshint','qunit']);
};
