riot.tag('test', '<h3>this is a test file</h3>', function(opts) {

var type = 'JavaScript';
this.test = 'This is ' + type;
});
riot.tag('todo', '<h3>{opts.title}</h3>', function(opts) {
});
