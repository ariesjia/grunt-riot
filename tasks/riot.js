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

		var generateModularHeader = function () {
			var modules = options.modular instanceof Array ? options.modular : ['riot'];
			var params = '';
			var amdRequired = '';
			var commonJSRequired = '';

			modules.forEach(function (m, i) {
				if (typeof(m) === 'string') {
					var obj = {};
					obj[m] = m;
					m = obj;
				}

				for (var path in m) {
					var param = m[path];

					amdRequired += "'" + path + "'";
					commonJSRequired += '\t\tvar ' + param + ' = require(\'' + path + '\');\n';
					params += param;

					if (i < modules.length - 1) {
						amdRequired += ', ';
						params += ', ';
					}
				}
			});

			var header = '';
			header += '(function(tagger) {\n';
			header += '	if (typeof define === \'function\' && define.amd) {\n';
			header += '		define([' + amdRequired + '], function(' + params + ') {\n';
			header += '			tagger(' + params + ');\n';
			header += '		});\n';
			header += '	} else if (typeof module !== \'undefined\' && typeof module.exports !== \'undefined\') {\n';
			header += commonJSRequired;
			header += '		tagger(' + params + ');\n';
			header += '	} else {\n';
			header += '		tagger(window.riot);\n';
			header += '	}\n';
			header += '})(function(' + params + ') {\n';

			return header;
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

		var mHeader = generateModularHeader();

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
				files.src.map(function(file){
					writeFile(
						files.dest ,
						compileRiot( grunt.file.read(file) , getOptions(file,options) )
					);
				});
			}

		});

	});

};
