const assert = require('chai').assert;
const path = require('path');

const NamespaceManager = require('../../src/NamespaceManager');


function getFolderPath(folder)
{
	return path.resolve(__dirname, '../../test_utils/NamespaceManager', folder || '');
}


suite('NamespaceManager', () => 
{
	test('single object setup', () =>
	{
		var res;
		
		NamespaceManager.setup(
			getFolderPath('single_setup'),
			(root) => 
			{
				res = root.Example;
			}
		);
		
		assert.deepEqual({ "A": 2 }, res);
	});
	
	test('object setup in a namespace', () =>
	{
		var res;
		
		NamespaceManager.setup(
			getFolderPath('single_namespace_setup'),
			(root) => 
			{
				res = root.NS.Example;
			}
		);
		
		assert.deepEqual({ "A": 3 }, res);
	});
	
	test('number of objects setup in one definition', () =>
	{
		var res1, res2;
		
		NamespaceManager.setup(
			getFolderPath('one_definition_two_declarations'),
			(root) => 
			{
				res1 = root.NS.Example;
				res2 = root.NS.Ex2;
			}
		);
		
		assert.deepEqual({ "Main": 1 }, res1);
		assert.deepEqual({ "Extra": 2 }, res2);
	});
	
	test.only('number of definitions in one file', () =>
	{
		var res1, res2;
		
		NamespaceManager.setup(
			getFolderPath('one_file_two_definitions'),
			(root) => 
			{
				res1 = root.NS.Example;
				res2 = root.NS.d2.Ex2;
			}
		);
		
		assert.deepEqual({ "Main": 2 }, res1);
		assert.deepEqual({ "Extra": 3 }, res2);
	});
});