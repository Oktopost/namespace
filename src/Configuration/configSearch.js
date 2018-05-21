const fs		= require('fs');
const path		= require('path');


const FILE_NAME			= 'namespace.json';
const NODE_MODULE_DIR	= 'node_modules';


/**
 * @param {string} dirName
 * @param {string} p
 * @param {function(string, *)} callback
 * @param {function(string, Error)} onError
 * @private
 */
function _checkFile(dirName, p, callback, onError)
{
	if (fs.existsSync(p))
	{
		try 
		{
			var data = require(p);
			callback(dirName, data);
		}
		catch (e)
		{
			onError(p, e);
		}
	}
}


/**
 * @param {string} root
 * @param {function(string, *)} callback
 * @param {function(string, Error)} onError
 */
function configSearch(root, callback, onError)
{
	var items;
	var main;
	var nodeDir = path.join(root, NODE_MODULE_DIR);
	
	// Check local.
	main = path.join(root, FILE_NAME);
	_checkFile(path.basename(root), main, callback, onError);
	
	
	// Check node modules.
	if (!fs.existsSync(nodeDir))
	{
		return;
	}
	
	items = fs.readdirSync(path.join(root, NODE_MODULE_DIR));
	
	for (var i = 0; i < items.length; i++)
	{
		var fullPath = path.join(nodeDir, items[i]);
		var stat = fs.statSync(fullPath);
		
		if (stat.isDirectory())
		{
			_checkFile(items[i], path.join(fullPath, FILE_NAME), callback, onError);
		}
	}
}


module.exports = configSearch;