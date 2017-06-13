'use strict';


const ResolverCreatorFactory = require('../../../src/NamespaceLoader/Path/ResolverCreatorFactory');
const configParser = require('../../../src/NamespaceLoader/configParser');
const assert = require('chai').assert;


suite('configParser', () =>
{
	test('Empty config passed, return empty result', () =>
	{
		assert.deepEqual({}, configParser({}));
	});
	
	test('Empty config for type passed, return empty result', () =>
	{
		var factory = new ResolverCreatorFactory();
		var method = () => {};
		
		factory.register('a', () => method );
		
		assert.deepEqual({}, configParser({ a: {} }, factory));
	});
	
	test('Config for type called', () =>
	{
		var factory = new ResolverCreatorFactory();
		var method = () => {};
		var isCalled = false;
		
		factory.register('a', () => { isCalled = true; return method; });
		
		configParser({ a: { 'b': 'c' } }, factory);
		
		assert.equal(true, isCalled);
	});
	
	test('Parameters passed to type loader', () =>
	{
		var factory = new ResolverCreatorFactory();
		var method = () => {};
		var params = null;
		
		factory.register('a', (a, b) => { params = [a, b]; return method; });
		configParser({ a: { 'b': 'c' } }, factory);
		
		assert.deepEqual(['b', 'c'], params);
	});
	
	test('Loader result returned for type', () =>
	{
		var factory = new ResolverCreatorFactory();
		var method = () => {};
		
		factory.register('a', () => method );
		
		assert.deepEqual({ 'b': method }, configParser({ a: { 'b': 'c' } }, factory));
	});
	
	test('All types called', () =>
	{
		var factory = new ResolverCreatorFactory();
		var methodA = () => {};
		var methodB = () => {};
		
		factory.register({
			'a': () => methodA,
			'b': () => methodB
		});
		
		assert.deepEqual(
			{ 
				'b': methodA,
				'd': methodA,
				'b2': methodB,
				'd2': methodB
			},
			configParser(
				{ 
					a: { 
						'b': 'c',
						'd': 'e'
					},
					b: {
						'b2': 'c',
						'd2': 'e'
					}
				}, 
				factory));
	});
	
	
	test('Loader already registered, error thrown', () =>
	{
		var factory = new ResolverCreatorFactory();
		var method = () => {};
		
		factory.register({
			'a': () => method,
			'b': () => method
		});
		
		assert.throws(() => 
		{
			configParser(
				{ 
					a: { 'b': 'c' },
					b: { 'b': 'c2' }
				}, 
				factory);
		});
	});
});