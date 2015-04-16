/*
 * grunt-riot
 *
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var riot = require('riot'),
		path = require('path'),
		concat = require('concat-stream');

	grunt.registerMultiTask('riot', 'riot custom tag compiler plugin', function () {
		var self = this;

		var options = this.options({
			compact : true ,
			expr : true ,
			type : null ,
			template : null,
			fileConfig : null,
			concat : false,
			modular: false
		});

		var removeInvalidFiles = function(files) {
			return files.src.filter(function(filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});
		};

		var clone = function(obj) {
			return JSON.parse(JSON.stringify(obj));
		};

		var compileRiot = function(code, opts){
			return riot.compile(code,opts)
		};

		var writeFile = function (path, output) {
			grunt.file.write(path, output);
			grunt.log.writeln('File ' + path + ' created.');
		};

		function getOptions(file, options) {
			return options.fileConfig ? options.fileConfig(file,clone(options)) : options;
		}

		var validFiles = this.files.map(function (files) {
			return {
				src: removeInvalidFiles(files),
				dest: files.dest
			};
		});

		var mHeader = '';
		mHeader += '(function(tagger) {\n';
		mHeader += '  if (typeof define === \'function\' && define.amd) {\n';
		mHeader += '    define([\'riot\'], function(riot) { tagger(riot); });\n';
		mHeader += '  } else if (typeof module !== \'undefined\' && typeof module.exports !== \'undefined\') {\n';
		mHeader += '    tagger(require(\'riot\'));\n';
		mHeader += '  } else {\n';
		mHeader += '    tagger(window.riot);\n';
		mHeader += '  }\n';
		mHeader += '})(function(riot) {\n';

		var mFooter = '});';

		validFiles.forEach(function (files, x) {
			if(options.concat){
				var strings = concat(function(out) {
					writeFile(
						files.dest ,
						out
					);
				});
				files.src.map(function(file, y){
					var fileSource = compileRiot( grunt.file.read(file) , getOptions(file,options) );

					if (options.modular && x === 0 && y === 0)
						strings.write(mHeader);

					strings.write(fileSource + '\n');

					if (options.modular && !validFiles[x + 1] && y === files.src.length - 1)
						strings.write(mFooter);

				});
				strings.end();
			}else{
				validFiles.map(function(file){
					writeFile(
						files.dest ,
						compileRiot( grunt.file.read(file) , getOptions(file,options) )
					);
				});
			}

		});

	});

};
