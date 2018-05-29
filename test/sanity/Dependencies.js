const path		= require('path');
const assert	= require('chai').assert;

const NamespaceManager				= require('../../src/NamespaceManager');


function getFolderPath(folder)
{
	return path.resolve(__dirname, '../../test_utils/Dependencies', folder || '');
}

function compare(folder, expected, result)
{
	var p = path.resolve(__dirname, '../../test_utils/Dependencies', folder);
	
	for (var key in expected)
	{
		expected[key] = path.resolve(p, expected[key]);
	}
	
	assert.deepEqual(result, expected);
}


suite('ExceptionsHandling - NamespaceManager', () => 
{
	test('sanity', () =>
	{
		var ns = NamespaceManager.setup(
			getFolderPath('sanity'),
			(root) => 
			{
				root.NS.Example;
			}
		);
		
		compare(
			'sanity',
			[
				'B.js',
				'A.js',
				'Example.js'
			],
			ns.dependencies('NS.Example')
		);
	});
	
	test('complex', () =>
	{
		var ns = NamespaceManager.setup(
			getFolderPath('complex'),
			(root) => 
			{
				root.NS.Example;
			}
		);
		
		compare(
			'complex',
			[
				'A.js',
				'B.js',
				'C.js',
				'D.js',
				'E.js',
				'F.js',
				'G.js',
				'Example.js'
			],
			ns.dependencies('NS.Example')
		);
	});
});