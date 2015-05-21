(function(root, factory) {
	if (typeof(define) === 'function' && define.amd) {
		define(['riot', 'jquery', 'lib/my_module'], function(riot, $, MyModule) {
			factory(riot, $, MyModule);
		});
	}
	else if (typeof(module) !== 'undefined' && typeof module.exports !== 'undefined') {
		var riot = require('riot');
		var $ = require('jquery');
		var MyModule = require('lib/my_module');

		factory(riot, $, MyModule);
	}
	else {
		factory(root.riot, root.$, root.MyModule);
	}
})(this, function(riot, $, MyModule) {
	riot.tag('test', '<h3>{this is a test file}</h3>', function(opts) {
			console.log('test')
	});
	riot.tag('todo', '<h3>{opts.title}</h3><ul><li each="{items}"><label class="{completed: done}"><input type="checkbox" __checked="{done}" onclick="{parent.toggle}"> {title} </label></li></ul><form onsubmit="{add}"><input name="input" onkeyup="{edit}"><button __disabled="{!text}">Add #{items.length + 1}</button></form>', function(opts) {
			this.disabled = true

			this.items = opts.items

			this.edit = function(e) {
				this.text = e.target.value
			}.bind(this);

			this.add = function(e) {
				if (this.text) {
					this.items.push({ title: this.text })
					this.text = this.input.value = ''
				}
			}.bind(this);

			this.toggle = function(e) {
				var item = e.item
				item.done = !item.done
				return true
			}.bind(this);

	});

});