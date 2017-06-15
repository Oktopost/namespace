'use strict';


const path = require('path');


const ROOT = {
	_rootPath: '',
	_isSet: false,
	
	
	set: function (path) 
	{
		if (ROOT._isSet === false)
		{
			ROOT._isSet = true;
			ROOT._rootPath = path;
		}
	},
	
	path: function ()
	{
		ROOT._rootPath = ROOT._rootPath || path.dirname(require.main.filename);
		return ROOT._rootPath;
	},
	
	directory: function ()
	{
		return path.basename(ROOT.path());
	}
};


module.exports = ROOT;