'use strict';


const configSearch = require('../../../src/Configuration/configSearch');
const assert = require('chai').assert;

const path = require('path');


suite('configSearch', () =>
{
	var mainDir = __dirname + '/configSearch_test';
	
	
	function getPath(to)
	{
		return path.join(mainDir, to);
	}
	
	
	test('empty directories', () => 
	{
		configSearch(getPath('empty'), () => {}, () => {});
	});
	
	test('main namespace json included', () => 
	{
		var calledWith;
		
		configSearch(
			getPath('onlyMain'),
			(source, a) => { calledWith = a },
			() => {});
		
		assert.deepEqual(calledWith, { a: "b" });
	});
	
	test('main directory passed to callback', () => 
	{
		var calledWith;
		
		configSearch(
			getPath('onlyMain'),
			(source, a) => { calledWith = source },
			() => {});
		
		assert.deepEqual(calledWith, 'onlyMain');
	});
	
	test('empty node_module dir', () => 
	{
		configSearch(getPath('empty_modules'), () => {}, () => {});
	});
	
	test('node_module with modules but no namespace', () => 
	{
		configSearch(getPath('have_modules'), () => {}, () => {});
	});
	
	test('node_module with modules that have namespace', () => 
	{
		configSearch(getPath('have_namespace'), () => {}, () => {});
	});
	
	test('value of namespace.json in module passed', () => 
	{
		var calledWith;
		
		configSearch(
			getPath('have_namespace'),
			(source, a) => { calledWith = a },
			() => {});
		
		assert.deepEqual(calledWith, { a: "have_name" });
	});
	
	test('Module name passed as source', () => 
	{
		var calledWith;
		
		configSearch(
			getPath('have_namespace'),
			(source, a) => { calledWith = source },
			() => {});
		
		assert.deepEqual(calledWith, 'mod_a');
	});
	
	test('Number of modules', () => 
	{
		configSearch(
			getPath('number_of_namespace'),
			() => {},
			() => {});
	});
	
	test('Number of modules, all values passed to callback', () => 
	{
		var calledWith = [];
		
		configSearch(
			getPath('number_of_namespace'),
			(s, data) => { calledWith.push(data); },
			() => {});
		
		assert.deepEqual(
			calledWith,
			[
				{ a: 'have_name_a' },
				{ b: 'have_name_b' }
			]
		);
	});
	
	test('Number of modules, all module names passed', () => 
	{
		var calledWith = [];
		
		configSearch(
			getPath('number_of_namespace'),
			(s, data) => { calledWith.push(s); },
			() => {});
		
		assert.deepEqual(
			calledWith,
			[ 'mod_a', 'mod_b' ]
		);
	});
	
	test('Error in namespace, handler called', () => 
	{
		var calledWith;
		
		configSearch(
			getPath('error'),
			() => {},
			(source, e) => { calledWith = e; });
		
		assert.instanceOf(calledWith, Error);
	});
	
	test('Error in namespace, file name passed', () => 
	{
		var calledWith;
		
		configSearch(
			getPath('error'),
			() => {},
			(source, e) => { calledWith = source; });
		
		assert.equal(calledWith, path.join(mainDir, 'error', 'namespace.json'));
	});
	
	test('Continue search even after error', () => 
	{
		var calledWithData = [];
		
		configSearch(
			getPath('error_continue'),
			(source, data) => { calledWithData.push(data); },
			() => { calledWithData.push(''); });
		
		assert.deepEqual(
			calledWithData, 
			[
				{ a: 'a' },
				'',
				{ c: 'c' }
			]);
	});
});