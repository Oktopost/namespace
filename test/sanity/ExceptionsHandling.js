const path		= require('path');
const assert	= require('chai').assert;

const NamespaceManager				= require('../../src/NamespaceManager');
const JavascriptException			= require('../../src/Exceptions/JavascriptException');
const InvalidPathException			= require('../../src/Exceptions/InvalidPathException');
const RecursiveDependencyException	= require('../../src/Exceptions/RecursiveDependencyException');


function getFolderPath(folder)
{
	return path.resolve(__dirname, '../../test_utils/ExceptionsHandling', folder || '');
}


suite('ExceptionsHandling - NamespaceManager', () => 
{
	test('Exception in javascript', () =>
	{
		assert.throws(() => 
			{
				NamespaceManager.setup(
					getFolderPath('exception_in_js'),
					(root) => 
					{
						root.NS.Example;
					}
				);
			},
			JavascriptException);
	});
	
	test('Recursive Dependency', () =>
	{
		assert.throws(() => 
			{
				NamespaceManager.setup(
					getFolderPath('recursive'),
					(root) => 
					{
						root.NS.Example;
					}
				);
			},
			RecursiveDependencyException);
	});
	
	test('Missing Item', () =>
	{
		assert.throws(() => 
			{
				NamespaceManager.setup(
					getFolderPath('missing'),
					(root) => 
					{
						root.NS.Example;
					}
				);
			},
			InvalidPathException);
	});
});