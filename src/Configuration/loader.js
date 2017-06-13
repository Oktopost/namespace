'use strict';


const ApplicationConfigFile		= require('./ApplicationConfigFile');
const builder					= require('./builder');
	
const ROOT_DIR	= path.basename(path.dirname(require.main.filename));


function loader(root)
{
	var file;
	var config;
	
	root = root || ROOT_DIR;
	file = new ApplicationConfigFile(root);
	
	config = file.load();
	
	if (config === null)
	{
		config = builder(root);
	}
	
	return config;
}


module.exports = loader;