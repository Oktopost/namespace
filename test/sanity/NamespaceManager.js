const assert = require('chai').assert;
const path = require('path');

const NamespaceManager = require('../../src/NamespaceManager');


function getFolderPath(folder)
{
	return path.resolve(__dirname, folder);
}


suite.only('NamespaceManager', () => 
{
	test('setup', () => 
	{
		var result = NamespaceManager.setup(getFolderPath('NamespaceManager'));
		assert.instanceOf(result, NamespaceManager);
	});
});