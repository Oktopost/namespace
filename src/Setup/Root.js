'use strict';


const path = require('path');


var rootPath = path.dirname(require.main.filename);


const ROOT = {
	_isSet: false,
	
	set: function (path) 
	{
		if (ROOT._isSet === false)
		{
			ROOT._isSet = true;
			rootPath = path;
		}
	},
	
	path: function ()
	{
		return rootPath;
	},
	
	directory: function ()
	{
		return path.basename(rootPath);
	}
};


module.exports = ROOT;