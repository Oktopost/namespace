'use strict';


const partialPath = require('../../../../../src/namespaceLoader/path/partial/partialPath');
const assert = require('chai').assert;


suite('partialPath', () => 
{
	suite('Namespace', () => 
	{
		test('Convert dot to slash', () => 
		{
			assert.equal('abc/def', partialPath('', '', 'abc.def'));
		});
		
		test('No sub namespaces', () => 
		{
			assert.equal('abc', partialPath('', '', 'abc'));
			assert.equal('abc', partialPath('pref', '', 'pref.abc'));
		});
	});
	
	
	suite('Directory', () => 
	{
		test('Empty directory', () => 
		{
			assert.equal('abc/def', partialPath('', '', 'abc.def'));
		});
		
		test('Relative path directory', () => 
		{
			assert.equal('./a/abc/def', partialPath('', './a/', 'abc.def'));
			assert.equal('a/abc/def', partialPath('', 'a/', 'abc.def'));
		});
		
		test('Full path directory', () => 
		{
			assert.equal('/a/abc/def', partialPath('', '/a/', 'abc.def'));
		});
		
		test('Directory path does not end with slash', () => 
		{
			assert.equal('/a/abc/def', partialPath('', '/a', 'abc.def'));
			assert.equal('./a/abc/def', partialPath('', './a', 'abc.def'));
			assert.equal('a/abc/def', partialPath('', 'a', 'abc.def'));
		});
	});
	
	
	suite('Prefix', () => 
	{
		test('Empty prefix ignored', () => 
		{
			assert.equal('/abc/def', partialPath('', '/', 'abc.def'));
		});
		
		test('Prefix subtracted', () => 
		{
			assert.equal('/abc/def', partialPath('pref', '/', 'pref.abc.def'));
		});
		
		test('Partial prefix subtracted', () => 
		{
			assert.equal('/f/abc/def', partialPath('pre', '/', 'pref.abc.def'));
		});
		
		test('Chained prefix subtracted', () => 
		{
			assert.equal('/abc/def', partialPath('pref.chain', '/', 'pref.chain.abc.def'));
		});
		
		test('Partial Chained prefix subtracted', () => 
		{
			assert.equal('/par/abc/def', partialPath('pref.chain', '/', 'pref.chainpar.abc.def'));
		});
		
		test('Namespace to short, error thrown', () => 
		{
			assert.throws(() => partialPath('prefix', '/', 'pref'));
			assert.throws(() => partialPath('prefix', '/', 'prefix'));
			assert.throws(() => partialPath('pre.fix', '/', 'pre.fix'));
			assert.throws(() => partialPath('pre.fix', '/', 'pre.f'));
		});
		
		test('Namespace does not start with prefix', () => 
		{
			assert.throws(() => partialPath('prefix', '/', 'notprefix'));
			assert.throws(() => partialPath('pre.fix', '/', 'notpre.fix'));
			assert.throws(() => partialPath('pre.fix', '/', 'not.pre'));
			assert.throws(() => partialPath('pre.fix', '/', 'not.fix'));
			assert.throws(() => partialPath('pre.fix', '/', 'notprefix'));
		});
	});
});
