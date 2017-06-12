'use strict';


const ChainCall = require('../../../src/NamespaceProxy/ChainCall');
const assert = require('chai').assert;


suite('ChainCall', () =>
{
	suite('add', () => 
	{
		test('Return self', () =>
		{
			var subject = new ChainCall();
			assert.equal(subject, subject.add([]));
		});
		
		test('Add empty array', () =>
		{
			var subject = new ChainCall();
			subject.add([]);
			
			assert.deepEqual([], subject._chain);
		});
		
		test('Add single function', () =>
		{
			var subject = new ChainCall();
			var func = () => {};
			
			subject.add(func);
			
			assert.deepEqual([func], subject._chain);
		});
		
		test('Add array of one function', () =>
		{
			var subject = new ChainCall();
			var func = () => {};
			
			subject.add([func]);
			
			assert.deepEqual([func], subject._chain);
		});
		
		test('Add array of functions', () =>
		{
			var subject = new ChainCall();
			var func1 = () => {};
			var func2 = () => {};
			
			subject.add([func1, func2]);
			
			assert.deepEqual([func1, func2], subject._chain);
		});
		
		test('Add array of functions to existing array', () =>
		{
			var subject = new ChainCall();
			var func1 = () => {};
			var func2 = () => {};
			
			var func3 = () => {};
			var func4 = () => {};
			
			subject.add([func1, func2]);
			subject.add([func3, func4]);
			
			assert.deepEqual([func3, func4, func1, func2], subject._chain);
		});
		
		test('Invalid input, error thrown', () =>
		{
			var subject = new ChainCall();
			assert.throws(() => subject.add(123));
		});
	});
	
	
	suite('addToEnd', () => 
	{
		test('Return self', () =>
		{
			var subject = new ChainCall();
			assert.equal(subject, subject.addToEnd([]));
		});
		
		test('Add empty array', () =>
		{
			var subject = new ChainCall();
			subject.addToEnd([]);
			
			assert.deepEqual([], subject._chain);
		});
		
		test('Add single function', () =>
		{
			var subject = new ChainCall();
			var func = () => {};
			
			subject.addToEnd(func);
			
			assert.deepEqual([func], subject._chain);
		});
		
		test('Add array of one function', () =>
		{
			var subject = new ChainCall();
			var func = () => {};
			
			subject.addToEnd([func]);
			
			assert.deepEqual([func], subject._chain);
		});
		
		test('Add array of functions', () =>
		{
			var subject = new ChainCall();
			var func1 = () => {};
			var func2 = () => {};
			
			subject.addToEnd([func1, func2]);
			
			assert.deepEqual([func1, func2], subject._chain);
		});
		
		test('Add array of functions to existing array', () =>
		{
			var subject = new ChainCall();
			
			var func1 = () => {};
			var func2 = () => {};
			var func3 = () => {};
			var func4 = () => {};
			
			subject.addToEnd([func1, func2]);
			subject.addToEnd([func3, func4]);
			
			assert.deepEqual([func1, func2, func3, func4], subject._chain);
		});
		
		test('Invalid input, error thrown', () =>
		{
			var subject = new ChainCall();
			assert.throws(() => subject.addToEnd(123));
		});
	});
	
	
	suite('invoke', () => 
	{
		test('Empty set', () => 
		{
			var subject = new ChainCall();
			subject.invoke();
		});
		
		test('Child function invoked', () => 
		{
			var subject = new ChainCall();
			var isCalled = false;
			
			subject.add(() => { isCalled = true; });
			subject.invoke();
			
			assert.equal(true, isCalled);
		});
		
		test('No arguments passed', () => 
		{
			var subject = new ChainCall();
			var length = false;
			
			subject.add(function () { length = arguments.length; });
			subject.invoke();
			
			assert.equal(1, length);
		});
		
		test('Callback passed', () => 
		{
			var subject = new ChainCall();
			var callback;
			
			subject.add(function () { callback = arguments[0]; });
			subject.invoke();
			
			assert.instanceOf(callback, Function);
		});
		
		test('Callback passed as last parameter', () => 
		{
			var subject = new ChainCall();
			var callback;
			
			subject.add(function () { callback = arguments[3]; });
			subject.invoke(1, 2, 3);
			
			assert.instanceOf(callback, Function);
		});
		
		test('Callback passed to all methods', () => 
		{
			var subject = new ChainCall();
			var lastCallback;
			
			subject.addToEnd(function (callback) { callback(); });
			subject.addToEnd(function (callback) { lastCallback = callback; callback(); });
			
			subject.invoke();
			
			assert.instanceOf(lastCallback, Function);
		});
		
		test('Parameters passed to callback', () => 
		{
			var subject = new ChainCall();
			var params;
			
			subject.add(function () { params = Array.prototype.slice.call(arguments, 0, 3); });
			subject.invoke(1, 2, 3);
			
			assert.deepEqual([1, 2, 3], params);
		});
		
		test('Functions invoked in right order', () => 
		{
			var subject = new ChainCall();
			var data = [];
			
			subject.addToEnd(function (callback) { data.push(1); callback(); });
			subject.addToEnd(function (callback) { data.push(2); callback(); });
			subject.invoke();
			
			assert.deepEqual([1, 2], data);
		});
		
		test('Params passed to all functions', () => 
		{
			var subject = new ChainCall();
			var data = [];
			
			subject.addToEnd(function (a, b, callback) { data.push(a, b); callback(); });
			subject.addToEnd(function (a, b, callback) { data.push(a, b); callback(); });
			subject.invoke(1, 2);
			
			assert.deepEqual([1, 2, 1, 2], data);
		});
		
		test('Last value returned', () => 
		{
			var subject = new ChainCall();
			
			subject.addToEnd(function (callback) { return callback(); });
			subject.addToEnd(function () { return 2; });
			
			assert.deepEqual(2, subject.invoke());
		});
	});
});