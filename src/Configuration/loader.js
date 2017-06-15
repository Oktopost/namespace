'use strict';


const Root						= require('../Setup/Root');
const ApplicationConfigFile		= require('./ApplicationConfigFile');
const builder					= require('./builder');


/**
 * @param root
 * @param {boolean=false} isVirtual
 * @return {{}|null|*}
 */
function loader(root, isVirtual)
{
	var file;
	var config;
	
	if (isVirtual !== true)
	{
		root = root || Root.path();
		file = new ApplicationConfigFile(root);
	
		config = file.load();
		
		if (config === null)
		{
			config = builder(root);
		}
	}
	
	return config || builder(root, isVirtual);
}


module.exports = loader;