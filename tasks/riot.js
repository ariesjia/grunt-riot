/*
 * grunt-riot
 *
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

'use strict';


module.exports = function (grunt) {
	require('grunt-modularize/tasks/modularize')(grunt);

	var riot = require('riot'),
		concat = require('concat-stream');

	grunt.registerMultiTask('riot', 'riot custom tag compiler plugin', function () {
		var options = this.options({
			compact: true,
			expr: true,
			type: null,
			template: null,
			fileConfig: null,
			concat: false,
			modular: false
		});

		var modularFiles = {};

		var removeInvalidFiles = function (files) {
			return files.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});
		};

		var clone = function (obj) {
			return JSON.parse(JSON.stringify(obj));
		};

		var compileRiot = function (code, opts) {
			return riot.compile(code, opts);
		};

		var writeFile = function (path, output) {
			grunt.file.write(path, output);
			grunt.log.writeln('File ' + path + ' created.');
		};

		function getOptions(file, options) {
			return options.fileConfig ? options.fileConfig(file, clone(options)) : options;
		}

		var validFiles = this.files.map(function (files) {
			return {
				src: removeInvalidFiles(files),
				dest: files.dest
			};
		});

		validFiles.forEach(function (files, x) {
			if (options.concat) {
				var strings = concat(function (out) {
					writeFile(
						files.dest,
						out
					);
				});
				files.src.map(function (file, y) {
					var fileSource = compileRiot(grunt.file.read(file), getOptions(file, options));
					strings.write(fileSource + '\n');
				});
				strings.end();
			} else {
				files.src.map(function (file) {
					writeFile(
						files.dest,
						compileRiot(grunt.file.read(file), getOptions(file, options))
					);
				});
			}

			if (options.modular) {
				modularFiles[files.dest] = files.dest;
			}
		});

		if (options.modular) {
			if (typeof(options.modular) !== 'object') {
				options.modular = {};
			}

			if (!options.modular.deps) {
				options.modular.deps = [];
			}

			var hasRiotDep;
			var len = options.modular.deps.length;

			for (var i = 0; i < len; i++) {
				var dep = options.modular.deps[i];

				if (dep === 'riot') {
					hasRiotDep = true;
					break;
				}
				else if (typeof(dep) === 'object' && Object.keys(dep)[0] === 'riot') {
					hasRiotDep = true;
					break;
				}
			}

			if (!hasRiotDep) {
				options.modular.deps.unshift('riot');
			}

			grunt.config.set('modularize.riot', {
				options: options.modular,
				files: modularFiles
			});

			grunt.task.run(['modularize:riot']);
		}
	});
};