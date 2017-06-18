# oktopost-namespace 

[![npm version](https://img.shields.io/npm/v/oktopost-namespace.svg)](https://www.npmjs.com/package/oktopost-namespace)
[![Build Status](https://travis-ci.org/Oktopost/namespace.svg?branch=master)](https://travis-ci.org/Oktopost/namespace)

The **oktopost-namespace** library aims to implement the usage of Namespaces inside JavaScript projects. 


## Table Of Content

  * [Installation](#installation)
  * [Basic Example](#basic-example)
  * [Building With Gulp Example](#bilding-with-gulp-example)
  * [More To Read](#more-to-read)


## Installation

```bash
npm install oktopost-namespace --save
```

## Basic Example

The following example will assumes the next directory structure:

```
src
  Example
    Subdir
      sub.js
      sum.js
    calc.js
namespace.json
index.js
```


**./src/Example/Subdir/sub.js**

> Define a new function named `sub` inside the namespace `Example.Subdir`
 
```js
namespace('Example.Subdir', function () 
{
	this.sub = function sub(a, b)
	{
		return a - b;
	}
});
```

**./src/Example/Subdir/sum.js**

> Define a new function named `sum` inside the namespace `Example.Subdir`

```js
namespace('Example.Subdir', function () 
{
	this.sum = function sum(a, b)
	{
		return a + b;
	}
});
```

**./src/Example/calc.js**

> Define a new function names `calc` inside the namespace `Example`

```js
namespace('Example.Subdir', function () 
{
	this.sum = function sum(a, b)
	{
		return a + b;
	}
});
```

**./src/namespace.json**

> `namespace.json` is the configuration file for the Namespace library.

```json
{
	"map":
	{
		"dir":
		{
			"Example": "./src/"
		}
	}
}
```


**./src/index.js**

> Load and setup the Namespace library. After calling the method `virtual`, the function `namespace` is registered into 
> the global scope and can be called using `global.namesapce(...)` or just `namespace(...)`.

```js
var root = require('oktopost-namespace').virtual(__dirname);
module.exports = root.Example;
```

All initialization methods including `virtual` will return the root object in which  all the namespaces are stored.


Few notes:
* Directory name must match the namespace name.
* In the current version, `this` should not be assigned a value more then once per file.


## Building With Gulp Example

Inside your `gulp.js` file, you can use the following snippet:

```js
let result = require('oktopost-namespace').getDependencies(
	__dirname, 
	() => {}, 
	(root) =>
	{
		const calc = root.Example.calc;
	});
```

The `result` variable will be equal to an array of file names ordered by there *dependency priority*. Starting from the
files that have no depends at all, and all the way to the enrty-point file of the project - that depends on all
other library files. 

In this case `result` it will be equal to:
```js
[
	'src/Example/Subdir/sub.js',
	'src/Example/Subdir/sum.js',
	'src/Example/calc.js'
]
```

If you project depends on any other files from different libraries, they will also be included inside this array.
For example: 

```js
[
	'node_modules/my_lib/src/other_file.js',
	'src/Example/calc.js'
]
```

### The `getDependencies(path, setupCallback, initCallback)` method:

* `path` must be the full directory path to `index.js` file.
* `setupCallback` this function is called before resolving dependencies. You can leave it empty for most cases.
* `initCallback` is a function that is used to load all dependencies. In most cases this can be done by loading the 
entry-point object of our library. In this case it's the `calc` function.


## More To Read

For more generic example, see the content of **[docs/example_01](docs/example_01)**

```ssh
git clone git@github.com:Oktopost/namespace.git
cd namespace/docs/example_01
npm install
node run_me.js
node run_me_gulp.js
```