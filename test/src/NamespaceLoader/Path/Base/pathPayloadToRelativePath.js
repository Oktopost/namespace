'use strict';


const pathPayloadToRelativePath = require('../../../../../src/NamespaceLoader/Path/Base/pathPayloadToRelativePath');
const assert = require('chai').assert;

const path = require('path');
const ROOT_DIR = path.basename(path.dirname(require.main.filename));


suite('pathPayloadToRelativePath', () => 
{
	test('In root directory', () => 
	{
		assert.equal(pathPayloadToRelativePath(ROOT_DIR, 'hello'), 'hello');
	});
	
	test('In root directory relative path', () => 
	{
		assert.equal(pathPayloadToRelativePath(ROOT_DIR, '/hello'), '/hello');
		assert.equal(pathPayloadToRelativePath(ROOT_DIR, './hello'), './hello');
		assert.equal(pathPayloadToRelativePath(ROOT_DIR, '../hello'), '../hello');
	});
	
	test('In module directory', () => 
	{
		assert.equal(pathPayloadToRelativePath('mod_a', 'path/to'), 'mod_a/path/to');
	});
	
	test('In module directory, relative path', () => 
	{
		assert.equal(pathPayloadToRelativePath('mod_a', './path/to'), 'mod_a/path/to');
		assert.equal(pathPayloadToRelativePath('mod_a', '/path/to'), '/path/to');
		assert.equal(pathPayloadToRelativePath('mod_a', '../path/to'), 'mod_a/../path/to');
	});
});