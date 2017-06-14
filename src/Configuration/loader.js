'use strict';


const Root						= require('../Setup/Root');
const ApplicationConfigFile		= require('./ApplicationConfigFile');
const builder					= require('./builder');
	

function loader(root)
{
	var file;
	var config;
	
	root = root || Root.path();
	file = new ApplicationConfigFile(root);
	
	config = file.load();
	
	if (config === null)
	{
		config = builder(root);
	}
	
	return config;
}


module.exports = loader;