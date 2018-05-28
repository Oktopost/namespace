const path		= require('path');
const assert	= require('chai').assert;

const NamespaceManager = require('../../src/NamespaceManager');


suite('NamespaceManager', () => 
{
	test('return self', () => 
	{
		var result = new NamespaceManager();
		
		assert.strictEqual(result, result.setup(__dirname));
		assert.strictEqual(result, result.addResolvers([]));
		assert.strictEqual(result, result.load(() => {}));
	});
	
	test('setup returns new object', () => 
	{
		var result = NamespaceManager.setup(getFolderPath());
		assert.instanceOf(result, NamespaceManager);
	});
});