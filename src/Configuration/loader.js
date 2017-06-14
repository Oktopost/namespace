'use strict';


const path 						= require('path');

const ApplicationConfigFile		= require('./ApplicationConfigFile');
const builder					= require('./builder');
	

const ROOT_PATH	= global.INDEX_DIRECTORY || path.dirname(require.main.filename);


function loader(root)
{
	var file;
	var config;
	
	root = root || ROOT_PATH;
	file = new ApplicationConfigFile(root);
	
	config = file.load();
	
	if (config === null)
	{
		config = builder(root);
	}
	
	return config;
}


module.exports = loader;