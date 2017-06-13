'use strict';


const ApplicationConfigFile = require('../../../src/Configuration/ApplicationConfigFile');
const assert = require('chai').assert;

const fs	= require('fs');
const path	= require('path');


suite('ApplicationConfigFile', () =>
{
	const MAIN_DIR = __dirname + '/ApplicationConfigFile_test';
	const FILE_NAME = 'namespace.json';
	
	
	function getPath(p)
	{
		return path.join(MAIN_DIR, p); 
	}
	
	function deleteIfExists(p)
	{
		if (fs.existsSync(p))
		{
			fs.unlinkSync(p);
		}
	}
	
	
	suite('isExists', () => 
	{
		test('File not exists', () => 
		{
			var subject = new ApplicationConfigFile(getPath('empty'));
			assert.equal(false, subject.isExists());
		});
		
		test('File exists', () => 
		{
			var subject = new ApplicationConfigFile(getPath('has_file'));
			assert.equal(true, subject.isExists());
		});
	});
	
	suite('load', () => 
	{
		test('File not exists, return null', () => 
		{
			var subject = new ApplicationConfigFile(getPath('empty'));
			assert.equal(null, subject.load());
		});
		
		test('File exists', () => 
		{
			var subject = new ApplicationConfigFile(getPath('has_file'));
			assert.deepEqual({ "A": "B" }, subject.load());
		});
	});
	
	suite('delete', () => 
	{
		test('File not exists', () => 
		{
			var p = getPath('delete_test/' + FILE_NAME);
			deleteIfExists(p);
			
			var subject = new ApplicationConfigFile(getPath('delete_test'));
			subject.delete();
		});
		
		test('File exists, file removed', () => 
		{
			var p = getPath('delete_test/' + FILE_NAME);
			deleteIfExists(p);
			
			fs.writeFileSync(p, '');
			
			var subject = new ApplicationConfigFile(getPath('delete_test'));
			subject.delete();
			
			assert.equal(false, fs.existsSync(p));
		});
	});
	
	suite('save', () => 
	{
		test('File not exists', () => 
		{
			var p = getPath('save_test/' + FILE_NAME);
			deleteIfExists(p);
			
			var subject = new ApplicationConfigFile(getPath('save_test'));
			subject.save({ a: 123 });
			
			assert.deepEqual(JSON.parse(fs.readFileSync(p)), { a: 123 });
			
			
			deleteIfExists(p);
		});
		
		test('File exists, override', () => 
		{
			var p = getPath('save_test/' + FILE_NAME);
			deleteIfExists(p);
			fs.writeFileSync(p, '{"b":"c"}');
			
			var subject = new ApplicationConfigFile(getPath('save_test'));
			subject.save({ a: 123 });
			
			assert.deepEqual(JSON.parse(fs.readFileSync(p)), { a: 123 });
			
			
			deleteIfExists(p);
		});
		
		test('Rewrite file number of times', () => 
		{
			var p = getPath('save_test/' + FILE_NAME);
			deleteIfExists(p);
			
			var subject = new ApplicationConfigFile(getPath('save_test'));
			subject.save({ a: 123 });
			
			var dataA = subject.load();
			
			subject.save({ b: "abc" });
			
			var dataB = subject.load();
			
			assert.deepEqual(dataA, { a: 123 });
			assert.deepEqual(dataB, { b: "abc" });
			
			
			deleteIfExists(p);
		});
	});
});