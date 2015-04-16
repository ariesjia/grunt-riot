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

		this.files.forEach(function (files, i) {
			var validFiles  = removeInvalidFiles(files);

			if(options.concat){
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

				var mFooter = '\n});';

				var strings = concat(function(out) {
					writeFile(
						files.dest ,
						out
					);
				});
				validFiles.map(function(file){
					var fileSource = compileRiot( grunt.file.read(file) , getOptions(file,options) );

					if (options.modular && i === 0)
						strings.write(mHeader);

					strings.write(fileSource);

					if (options.modular && i === self.files.length - 1)
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
