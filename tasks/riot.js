/*
 * grunt-riot
 *
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var compiler = require('riot/compiler');
    var compile = require('riot/compiler/compile');
    var path = require('path');

    grunt.registerMultiTask('riot', 'riot custom tag compule grunt plugin', function () {

        var options = this.options({
            ext: '.js',
            separator: grunt.util.linefeed
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

        var compileRiot = function(code, options){
            return compile(code,options)
        };

        var writeFile = function (path, output) {
            grunt.file.write(path, output);
            grunt.log.writeln('File ' + path + ' created.');
        };

        this.files.forEach(function (files) {
            var validFiles  = removeInvalidFiles(files);
            validFiles.map(function(file){
                writeFile(
                    files.dest ,
                    compileRiot(grunt.file.read(file) , options )
                );
            });
        });

    });

};
