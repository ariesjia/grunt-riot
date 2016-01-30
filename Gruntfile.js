/*
 * grunt-riot
 * 
 *
 * Copyright (c) 2015 
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
	// load all npm grunt tasks
	require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['test/tmp/**']
    },

    // Configuration to be run (and then tested).
    riot: {
      compile: {
        options: {
			concat: true
		},
        src: ['test/fixtures/test.tag','test/fixtures/todo.tag'],
        dest: 'test/tmp/concatFile.js'
      },
      es6: {
        options: {
          concat: true
        },
        src: 'test/fixtures/es6.tag',
        dest: 'test/tmp/es6.js'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'riot', 'nodeunit']);

  grunt.registerTask('compile', ['riot']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'clean']);
};
