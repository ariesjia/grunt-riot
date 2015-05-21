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
		concat = require('concat-stream');

	var modularize = require('./lib/modularize');

	var isType = function (type) {
		return function (obj) {
			return {}.toString.call(obj) == "[object " + type + "]";
		};
	};

	grunt.registerMultiTask('riot', 'riot custom tag compiler plugin', function () {
		var options = this.options({
			compact : true ,
			expr : true ,
			type : null ,
			template : null,
			fileConfig : null,
			concat : false,
			modular: false
		});

		var modularFiles = {};

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
			return riot.compile(code,opts);
		};

		var writeFile = function (path, output) {
			grunt.file.write(path, output);
			grunt.log.writeln('File ' + path + ' created.');
		};

		function getOptions(file, options) {
			return options.fileConfig ? options.fileConfig(file,clone(options)) : options;
		}

		function compileModular(source,config){
			config = config || options;

			if(config.modular){

				if(!isType("Object")(config.modular)){
					config.modular = {};
				}

				var modularConfig = config.modular ;

				modularConfig.deps = modularConfig.deps || [];

				if(modularConfig.deps.indexOf('riot') < 0){
					modularConfig.deps.unshift('riot');
				}

				modularConfig.input = source;

				return modularize(modularConfig);
			}else{
				return source;
			}
		}

		var validFiles = this.files.map(function (files) {
			return {
				src: removeInvalidFiles(files),
				dest: files.dest
			};
		});

		validFiles.forEach(function (files, x) {
			if(options.concat){
				var strings = concat(function(out) {
					writeFile(
						files.dest ,
						compileModular(out)
					);
				});
				files.src.map(function(file, y){
					var fileSource = compileRiot( grunt.file.read(file) , getOptions(file,options) );
					strings.write(fileSource + '\n');
				});

				strings.end();
			}else{
				files.src.map(function(file){
					writeFile(
						files.dest ,
						compileModular(
							compileRiot( grunt.file.read(file) , getOptions(file,options) ),
							getOptions(file,options)
						)
					);
				});
			}
		});

	});

};
