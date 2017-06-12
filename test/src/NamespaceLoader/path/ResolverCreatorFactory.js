'use strict';


const ResolverCreatorFactory = require('../../../../src/NamespaceLoader/path/ResolverCreatorFactory');
const assert = require('chai').assert;


suite('ResolverCreatorFactory', () => 
{
	suite('getCreator', () => 
	{
		test('Empty map, error thrown', () => 
		{
			assert.throws(() => 
			{
				(new ResolverCreatorFactory()).getCreator('a');
			});
		});
		
		test('Key not in map, error thrown', () => 
		{
			var subject = new ResolverCreatorFactory();
			subject.register('a', () => {});
			
			assert.throws(() => 
			{
				subject.getCreator('b');
			});
		});
		
		test('Key in map, element returned', () => 
		{
			var subject = new ResolverCreatorFactory();
			var func = () => {};
			
			subject.register('a', func);
			assert.equal(func, subject.getCreator('a'));
		});
	});
	
	suite('clone', () => 
	{
		test('Instance of ResolverCreatorFactory returned', () => {
			var subject = new ResolverCreatorFactory();
			var clone = subject.clone();
			
			assert.instanceOf(clone, ResolverCreatorFactory);
		});
		
		test('New Instance oreturned', () => {
			var subject = new ResolverCreatorFactory();
			var clone = subject.clone();
			
			assert.notEqual(clone, subject);
		});
		
		test('Map copied', () => {
			var subject = new ResolverCreatorFactory();
			
			subject.register('a', () => {});
			
			var clone = subject.clone();
			
			assert.equal(subject.getCreator('a'), clone.getCreator('a'));
		});
		
		test('Map copied by value', () => {
			var subject = new ResolverCreatorFactory();
			
			subject.register('a', () => {});
			
			var clone = subject.clone();
			
			subject.register('b', () => {});
			
			assert.throws(() => { clone.getCreator('b'); });
		});
	});
	
	suite('register', () =>
	{
		test('Register single function', () =>
		{
			var subject = new ResolverCreatorFactory();
			var func = () => {};
			
			subject.register('a', func);
			assert.equal(func, subject.getCreator('a'));
		});
		
		test('Register object', () =>
		{
			var subject = new ResolverCreatorFactory();
			var func = () => {};
			var obj = {	a: func };
			
			subject.register(obj);
			assert.equal(func, subject.getCreator('a'));
		});
		
		test('Register object with number of functions', () =>
		{
			var subject = new ResolverCreatorFactory();
			var funcA = () => {};
			var funcB = () => {};
			var obj = {	a: funcA, b: funcB };
			
			subject.register(obj);
			assert.equal(funcA, subject.getCreator('a'));
			assert.equal(funcB, subject.getCreator('b'));
		});
	});
	
	suite('static getCreator', () =>
	{
		test('instance getCreator called', () =>
		{
			var isCalled = false;
			
			delete ResolverCreatorFactory._instance;
			ResolverCreatorFactory._instance = { getCreator: () => { isCalled = true; }};
			
			ResolverCreatorFactory.getCreator('a');
			delete ResolverCreatorFactory._instance;
			
			assert.equal(true, isCalled);
		});
		
		test('Parameter passed to instance getCreator', () =>
		{
			var calledWith;
			
			delete ResolverCreatorFactory._instance;
			ResolverCreatorFactory._instance = { getCreator: (a) => { calledWith = a; }};
			
			ResolverCreatorFactory.getCreator('abc');
			delete ResolverCreatorFactory._instance;
			
			assert.equal('abc', calledWith);
		});
	});
	
	suite('static instace', () =>
	{
		test('instance getCreator called', () =>
		{
			var obj = {};
			
			delete ResolverCreatorFactory._instance;
			ResolverCreatorFactory._instance = obj;
			
			var res = ResolverCreatorFactory.instance();
			delete ResolverCreatorFactory._instance;
			
			assert.equal(res, obj);
		});
	});
});