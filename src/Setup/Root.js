'use strict';


const path = require('path');


var rootPath = path.dirname(require.main.filename);


const ROOT = {
	set: function (path) 
	{
		rootPath = path;
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