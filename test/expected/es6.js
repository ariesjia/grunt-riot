riot.tag2('test', '<h3>{text} {name} {point}</h3>', '', '', function(opts) {
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var text = "HELLO";

var name = (function () {
	return 'WORLD';
})();

var Point = (function () {
	function Point(x, y) {
		_classCallCheck(this, Point);

		this.x = x;
		this.y = y;
	}

	_createClass(Point, [{
		key: 'toString',
		value: function toString() {
			return '(' + this.x + ', ' + this.y + ')';
		}
	}]);

	return Point;
})();

this.text = text;
this.name = name;
this.point = new Point(1, 1).toString();
}, '{ }');
