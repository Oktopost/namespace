'use strict';


const directoryPathResolver = require('../../../../../src/NamespaceLoader/path/Directory/directoryPathResolver');
const assert = require('chai').assert;


suite('directoryPathResolver', () => 
{
	test('Convert dot to slash', () => 
	{
		assert.equal('a/abc/def', directoryPathResolver('a/', 'abc.def'));
	});
	
	test('Convert dot to slash in long path', () => 
	{
		assert.equal('a/abc/def/hij', directoryPathResolver('a/', 'abc.def.hij'));
	});
	
	test('No sub namespaces', () => 
	{
		assert.equal('abc', directoryPathResolver('', 'abc'));
	});
	
	
	test('Empty directory ignored', () => 
	{
		assert.equal('abc', directoryPathResolver('', 'abc'));
	});
	
	test('Relative path directory', () => 
	{
		assert.equal('./a/abc', directoryPathResolver('./a/', 'abc'));
		assert.equal('a/abc', directoryPathResolver('a/', 'abc'));
	});
	
	test('Full path directory added', () => 
	{
		assert.equal('/a/b/abc', directoryPathResolver('/a/b/', 'abc'));
	});
	
	test('Directory path does not end with slash', () => 
	{
		assert.equal('/a/abc', directoryPathResolver('/a', 'abc'));
	});
});