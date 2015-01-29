# grunt-riot

> The best Grunt plugin ever.


## Riot 
[Grunt](http://gruntjs.com/)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-riot --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-riot');
```


### Usage Examples

```js
grunt.initConfig({
  riot: {
    expand: true,
    cwd: '<%= app %>/scripts',
    src: '**/*.tag',
    dest: '<%= app %>/scripts',
    ext: '.js'
  },
})
```

## Release History
2015-01-26  0.0.1

## License
Copyright (c) 2015 . Licensed under the MIT license.
