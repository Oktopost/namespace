'use strict';


const Namespace = require('../../src/Namespace');
const assert = require('chai').assert;



suite('Namespace', () => {
	
	suite('constructor', () => {
		
		test('Object Created', () => {
			var n = new Namespace({});
			assert.instanceOf(n, Namespace);
		});
		
		test('Object is empty', () => {
			var n = new Namespace({});
			delete n._root;
			
			for (var k in n) {
				if (n.hasOwnProperty(k)) {
					assert.fail(k, undefined, 'Object should not have the key ' + k);
				}
			}
		});
		
		test('No default object passed to namespace, new object used', () => {
			var n = new Namespace();
			
			n.namespace('', function(root) {
				assert.deepEqual({}, root);
			});
			
			delete global.__test_namespace__;
		});
		
		test('No default object passed to namespace, new object used for each namespace', () => {
			var obj1;
			var obj2;
			
			(new Namespace()).namespace('a.b', function(container) {
				obj1 = container;
			});
			
			(new Namespace()).namespace('b.b', function(container) {
				obj2 = container;
			});
			
			assert.notEqual(obj1, obj2);
		});
		
		test('No default object passed to namespace, window scope used', () => {
			global.window = {};
			
			var n = new Namespace();
			
			try {
				n.namespace('a.b', function(root) {
					assert.equal(global.window, root);
				});
			} catch (e) {
				delete global.window;
				throw e;
			}
		});
	});
	
	
	suite('get', () => {
		test('Namespace exists, namespace returned', () => {
			var obj = { a: {} };
			var n = new Namespace(obj);
			
			assert.equal(obj.a, n.get('a'));
		});
		
		test('Namespace not exists, namespace created', () => {
			var obj = { };
			var n = new Namespace(obj);
			
			var a = n.get('a');
			
			assert.isDefined(obj.a);
			assert.equal(obj.a, a);
		});
		
		test('Deep namespace exists, namespace returned', () => {
			var obj = { a: { b: {} } };
			var n = new Namespace(obj);
			
			assert.equal(obj.a.b, n.get('a.b'));
		});
		
		test('Deep namespace missing, namespace created', () => {
			var obj = { a: { b: {} } };
			var n = new Namespace(obj);
			
			var result = n.get('a.b.c.d');
			
			assert.isDefined(obj.a.b.c.d);
			assert.equal(obj.a.b.c.d, result);
		});
		
		test('Deep namespace does not modify existing', () => {
			var obj = { a: { b: {} } };
			var objA = obj.a;
			var objB = obj.a.b;
			
			var n = new Namespace(obj);
			
			n.get('a.b.c');
			
			assert.equal(obj.a, objA);
			assert.equal(obj.a.b, objB);
		});
		
		test('No namespace passed, return root', () => {
			var obj = { a: { b: {} } };
			var n = new Namespace(obj);
			
			assert.equal(obj, n.get(''));
			assert.equal(obj, n.get(undefined));
		});
	});
	
	
	suite('isSet', () => {
		test('Namespace exists, return true', () => {
			var obj = { a: {} };
			var n = new Namespace(obj);
			
			assert.isTrue(n.isSet('a'));
		});
		
		test('Namespace not exists, return false', () => {
			var obj = { };
			var n = new Namespace(obj);
			
			assert.isFalse(n.isSet('a'));
		});
		test('Deep namespace exists, return true', () => {
			var obj = { a: { b: { c: {} } } };
			var n = new Namespace(obj);
			
			assert.isTrue(n.isSet('a.b.c'));
		});
		
		test('Deep namespace not exists, return false', () => {
			var obj = { a: { b: {} } };
			var n = new Namespace(obj);
			
			assert.isFalse(n.isSet('a.b.c.d'));
		});
		
		test('No namespace passed, return true', () => {
			var obj = { a: { b: {} } };
			var n = new Namespace(obj);
			
			assert.isTrue(n.isSet(''));
			assert.isTrue(n.isSet(undefined));
		});
	});
	
	
	suite('namespace', () => {
		test('Namespace exists, namespace passed as this', () => {
			var obj = { a: {} };
			var n = new Namespace(obj);
			var self;
			
			n.namespace('a', function() {
				self = this;
			});
			
			assert.equal(obj.a, self);
		});
		
		test('Namespace exists, root object passed as first param', () => {
			var obj = { a: {} };
			var n = new Namespace(obj);
			var glob;
			
			n.namespace('a', function(a) {
				glob = a;
			});
			
			assert.equal(obj, glob);
		});
		
		test('Namespace not exists, namespace object created', () => {
			var obj = { };
			var n = new Namespace(obj);
			var self;
			
			n.namespace('a', function() {
				self = this;
			});
			
			assert.isDefined(obj.a);
			assert.equal(obj.a, self);
		});
		
		test('Deep namespace exists, namespace object returned', () => {
			var obj = { a: { b: { c: {} } } };
			var n = new Namespace(obj);
			var self;
			
			n.namespace('a.b.c', function() {
				self = this;
			});
			
			assert.equal(obj.a.b.c, self);
		});
		
		test('Deep namespace doesn\'t exists, namespace object created', () => {
			var obj = { a: { } };
			var n = new Namespace(obj);
			var self;
			
			n.namespace('a.b.c', function() {
				self = this;
			});
			
			assert.isDefined(obj.a.b.c);
			assert.equal(obj.a.b.c, self);
		});
		
		test('Deep namespace does not modify existing', () => {
			var obj = { a: { b: {} } };
			var objA = obj.a;
			var objB = obj.a.b;
			
			var n = new Namespace(obj);
			
			n.namespace('a.b.c', function() {});
			
			assert.equal(obj.a, objA);
			assert.equal(obj.a.b, objB);
		});
		
		test('Callback not passed, namespace created', () => {
			var obj = { a: { b: {} } };
			var n = new Namespace(obj);
			
			n.namespace('a.b.c');
			
			assert.isDefined(obj.a.b.c);
		});
	});
	
	suite('getCreator', () => {
		test('function returned', () => {
			assert.isFunction((new Namespace({})).getCreator());
		});
		
		test('Function acts as the namespace function', () => {
			var obj = {};
			var creator = (new Namespace(obj)).getCreator();
			
			
			creator('a', function() {
				assert.equal(obj.a, this);
				this.b = 2;
			});
			
			assert.deepEqual({ a: { b: 2 } }, obj);
		});
	})
});