'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/


var cleanCode =  function (str){
	return str.replace(/\ +/g,"")
		.replace(/[ ]/g,"")
		.replace(/[\r\n\t]/g,"");
};

exports.riot = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  compile: function (test) {
    var actual = grunt.file.read('test/tmp/concatFile.js');
    var expected = grunt.file.read('test/expected/concatFile.js');
    test.equal(cleanCode(actual),cleanCode(expected));
    test.done();
  }

};
