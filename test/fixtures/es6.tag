<test>

	<h3>{text} {name} {point}</h3>

	<script type="es6">

		const text = "HELLO"

		const name = ()=>{
			return 'WORLD';
		}();

		class Point {
		  constructor(x, y) {
		    this.x = x;
		    this.y = y;
		  }

		  toString() {
		    return '(' + this.x + ', ' + this.y + ')';
		  }
		}

		this.text = text;
		this.name = name;
		this.point = (new Point(1,1)).toString()

	</script>

</test>