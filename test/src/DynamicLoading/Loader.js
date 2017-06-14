'use strict';


const Loader = require('../../../src/DynamicLoading/Loader');
const assert = require('chai').assert;


suite('Loader', () =>
{
	suite('add', () =>
	{
		test('Empty map', () =>
		{
			var loader = new Loader();
			
			loader.add({});
			
			assert.deepEqual({}, loader._map);
		});
		
		test('Empty loader', () =>
		{
			var loader = new Loader();
			var obj = { m: () => {} };
			
			loader.add(obj);
			
			assert.deepEqual(obj, loader._map);
		});
		
		test('Map with number of elements', () =>
		{
			var loader = new Loader();
			var obj = { 
				m1: () => {},
				m2: () => {}
			};
			
			loader.add(obj);
			
			assert.deepEqual(obj, loader._map);
		});
		
		test('Merging number of elements', () =>
		{
			var loader = new Loader();
			var obj1 = { 
				m1: () => {},
				m2: () => {}
			};
			
			var obj2 = { 
				m3: () => {},
				m4: () => {}
			};
			
			loader.add(obj1);
			loader.add(obj2);
			
			assert.deepEqual(
				{ 
					m1: obj1.m1,
					m2: obj1.m2,
					m3: obj2.m3,
					m4: obj2.m4	
				}, 
				loader._map);
		});
		
		test('Loader already exists, error thrown', () =>
		{
			var loader = new Loader();
			
			loader.add({ a: () => {} });
			assert.throws(() => { loader.add({ a: () => {} }); });
		});
	});
	
	
	suite('tryResolve', () =>
	{
		test('Empty map', () =>
		{
			var loader = new Loader();
			assert.equal(null, loader.tryResolve('abc'));
		});
		
		test('namespace not in map', () =>
		{
			var loader = new Loader();
			
			loader.add({ 'a': () => {} });
			
			assert.equal(null, loader.tryResolve('abc'));
		});
		
		test('loader found, loader called', () =>
		{
			var loader = new Loader();
			var calledWith = null;
			
			loader.add({ 'abc': (namespace) => { calledWith = namespace; return 'b'; } });
			loader.tryResolve('abcdef');
			
			assert.equal('abcdef', calledWith);
		});
		
		test('loader found, loader result returned', () =>
		{
			var loader = new Loader();
			
			loader.add({ 'abc': () => { return 'ok'; } });
			
			assert.equal('ok', loader.tryResolve('abcdef'));
		});
		
		test('best match loader used', () =>
		{
			var loader = new Loader();
			
			loader.add({
				'abc': 	() => { return 'a'; },
				'ab':	() => { return 'b'; },
				'abcd':	() => { return 'c'; },
				'abce':	() => { return 'd'; },
				'a':	() => { return 'e'; }
			});
			
			assert.equal('c', loader.tryResolve('abcdef'));
		});
		
		test('best match loader used', () =>
		{
			var loader = new Loader();
			
			loader.add({
				'abc': 	() => { return 'a'; },
				'ab':	() => { return 'b'; },
				'abcd':	() => { return 'c'; },
				'abce':	() => { return 'd'; },
				'a':	() => { return 'e'; }
			});
			
			assert.equal('c', loader.tryResolve('abcdef'));
		});
	});
	
	suite('resolve', () =>
	{
		test('Not found, error thrown', () => 
		{
			var loader = new Loader();
			
			loader.add({ 'a': () => {} });
			
			assert.throws(() =>  { loader.resolve('nnn'); });
		});
		
		test('Found, returned', () => 
		{
			var loader = new Loader();
			
			loader.add({ 'a': () => 'b' });
			
			assert.equal('b', loader.resolve('abc'));
		});
	});
	
	
	suite('tryGet', () =>
	{
		test('Namespace not found, null returned', () => 
		{
			var loader = new Loader();
			assert.equal(null, loader.tryGet('nnn'));
		});
		
		test('Invalid require target, null returned', () => 
		{
			var loader = new Loader();
			
			loader.add({ 'a': () => { return __dirname + '/InvalidIncludePath'} });
			
			assert.equal(null, loader.tryGet('abc'));
		});
		
		test('Element found and valid, element required and returned', () => 
		{
			var loader = new Loader();
			var object = require('./Loader_test/valid');
			
			loader.add({ 'a': () => { return __dirname + '/Loader_test/valid'} });
			
			assert.equal(object, loader.tryGet('abc'));
		});
	});
	
	
	suite('get', () =>
	{
		test('Namespace not found, error thrown', () => 
		{
			var loader = new Loader();
			assert.throws(() => { loader.get('abc'); });
		});
		
		test('Invalid require target, error thrown', () => 
		{
			var loader = new Loader();
			
			loader.add({ 'a': () => { return __dirname + '/InvalidIncludePath'} });
			
			assert.throws(() => { loader.get('abc'); });
		});
		
		test('Element found and valid, element required and returned', () => 
		{
			var loader = new Loader();
			var object = require('./Loader_test/valid');
			
			loader.add({ 'a': () => { return __dirname + '/Loader_test/valid'} });
			
			assert.equal(object, loader.get('abc'));
		});
	});
});