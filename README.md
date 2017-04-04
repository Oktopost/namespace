# Namespace 

Small library to easily create and manage namespaces in javascript.

[![Build Status](https://travis-ci.org/Oktopost/namespace.svg?branch=master)](https://travis-ci.org/Oktopost/namespace)
[![Coverage Status](https://coveralls.io/repos/github/Oktopost/namespace/badge.svg?branch=master&1)](https://coveralls.io/github/Oktopost/namespace?branch=master&1) 

## Table Of Content

  * [Installation](#installation)
    * [bower](#bower)
    * [npm](#npm)
  * [Usage](#usage)
    * [Creation](#creating-a-new-namespace-object)
    * [Accessing](#accessing-existing-namespaces)
    * [Methods](#methods)
        * [isSet](#isset)
        * [get](#get)
        * [namespace](#namespace)
  * [Web Example](#web-example)


## Installation

### bower
```bash
bower install oktopost-namespace
```

### npm
```bash
npm install oktopost-namespace --save
```

## Usage

For web, Namespace is register in the window scope, and defined globally.

For node use require

```js
const Namespace = require('oktopost-namespace').Namespace;
```

### Creating a new namespace object

```js
var myNamespace = new Namespace({});
```

First parameter of the Namespace constructor, is the **root** object that will hold the namespace.
If no parameter passed, this **root** is set to the *global* scope (*window* for web). All created 
namespaces are store inside the **root** object.

```js
var obj = {};
var myNamespace = new Namespace(obj);
myNamespace.namespace('a.b');

console.log(obj); // Will print { a: { b: {} } }


var GlobalNamespace = new Namespace();
GlobalNamespace.namespace('a.b');

console.log(window.a); // Will print { b: {} }
```

### Accessing existing namespaces
To access a created namespace, retrieve it from the root object.

```js
var myNamespace = new Namespace();
myNamespace.namespace('a.b');

var A_B = window.a.b;
```

### Methods

#### isSet
```isSet(string path)```

Return true if given path exists inside the namespace.

```js
myNamespace.namespace('a.b');

console.log(myNamespace.isSet('a.b')); // true
console.log(myNamespace.isSet('a.c')); // false
```

#### get
``` get(string path)```

Get a namespace by path. If part of the path does not exists, it will be created.

```js
var A_B = myNamespace.get('a.b');
```

#### namespace
``` namespace(string path, [function({} root) callback])```

Create a new namespace. If callback passed, it will be invoked in the following way:
* **this** - will be set to the newly created namespace according to the *path* parameter
* **root parameter** - will be set to the root object passed to Namespace constructor.

```js
var myNamespace = new Namespace();

myNamespace.namespace('a.b', function(root) {
    console.log(this); // Will print window.a.b object.
    console.log(root); // Will print the root object passed to namespace. In this case window.
});
```

## Web Example


**public/js/boot.js**
```js
window.MyApp = new Namespace(window);

// My help readability but should be used only in final applications and not libraries.
window.namespace = MyApp.namespace;
```

**public/js/lib/SomeClass.js**
```js
namespace('MyApp.lib', function() {
    
    /**
     * @class MyApp.lib.SomeClass
     */
    this.SomeClass = function SomeClass(a) {
        this._a = a;
    };
    
    SomeClass.prototype.getA = function() {
        return this._a;
    };
});
```


**public/js/lib/UseSomeClass.js**
```js
namespace('MyApp.lib', function(root) {
    
    // var someClass = root.MyApp.lib.someClass; 
    // var someClass = window.MyApp.lib.someClass;
    var SomeClass = MyApp.lib.someClass; 
    
    var instance = new SomeClass(2);
});
```
