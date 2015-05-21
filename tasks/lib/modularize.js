Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (options) {
	var input = options.input;
	var deps = options.deps;
	var exports = options.exports;
	var type = options.type;

	deps = deps || [];

	var params = '';
	var rootParams = '';
	var amdRequired = '';
	var commonJSRequired = '';
	var returns = '';

	for (var i = 0; i < deps.length; i++) {
		var dependency = deps[i];

		if (typeof dependency === 'string') {
			var obj = {};
			obj[dependency] = dependency;
			dependency = obj;
		}

		for (var path in dependency) {
			var param = dependency[path];
			var sep = i < deps.length - 1 ? ', ' : '';

			amdRequired += '\'' + path + '\'' + sep;
			commonJSRequired += '\t\tvar ' + param + ' = require(\'' + path + '\');\n';
			params += '' + param + '' + sep;
			rootParams += 'root.' + param + '' + sep;
		}
	}

	if (exports) returns = 'return ';

	function content() {
		var output = '';
		var lines = input.replace(/\r\n/g, '\n').split('\n');
		var len = lines.length;

		for (var j = 0; j < len; j++) {
			output += '\t' + lines[j] + '\n';
		}

		return output + (exports ? '\n\treturn ' + exports + ';' : '');
	}

	function amd() {
		return 'define([' + amdRequired + '], function(' + params + ') {\n' + content() + '\n});';
	}

	function commonjs() {
		return '' + commonJSRequired + '\n' + content();
	}

	function umd() {
		return '(function(root, factory) {\n\tif (typeof(define) === \'function\' && define.amd) {\n\t\tdefine([' + amdRequired + '], function(' + params + ') {\n\t\t\t' + returns + 'factory(' + params + ');\n\t\t});\n\t}\n\telse if (typeof(module) !== \'undefined\' && typeof module.exports !== \'undefined\') {\n' + commonJSRequired + '\n\t\t' + returns + 'factory(' + params + ');\n\t}\n\telse {\n\t\t' + returns + 'factory(' + rootParams + ');\n\t}\n})(this, function(' + params + ') {\n' + content() + '\n});';
	}

	switch (type) {
		case 'amd':
			return amd();
		case 'common':
			return commonjs();
		default:
			return umd();
	}
};

module.exports = exports['default'];