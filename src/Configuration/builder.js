'use strict';


const Root						= require('../Setup/Root');
const configSearch				= require('./configSearch');
const ApplicationConfigFile		= require('./ApplicationConfigFile');
const ResolverCreatorFactory	= require('../DynamicLoading/Path/ResolverCreatorFactory');


const path = require('path');


function _combineLoader(configLoaders, module, type, localLoaders)
{
	var key;
	var resolve = (module === Root.directory() ? 
		(a, b) => b : 
		ResolverCreatorFactory.getPathResolveCallback(type));
	
	for (key in localLoaders)
	{
		if (!localLoaders.hasOwnProperty(key))
			continue;
		
		if (typeof configLoaders[key] !== 'undefined')
		{
			throw new Error('Error when loading loader of module ' + module + 
				'. Loader for the key ' + key + ' already defined');
		}
	}
	
	for (key in localLoaders)
	{
		if (!localLoaders.hasOwnProperty(key))
			continue;
		
		configLoaders[key] = resolve(module, localLoaders[key]);
	}
}

/**
 * @param {{}} config
 * @param {string} module
 * @param {{}} data
 * @private
 */
function _combineMain(config, module, data)
{
	if (typeof data['map'] === 'undefined')
		return;
	
	var dataMap = data.map;
	
	for (var key in dataMap)
	{
		if (!dataMap.hasOwnProperty(key))
			continue;
		
		if (typeof config.map[key] === 'undefined')
		{
			config.map[key] = {};
		}
		
		try
		{
			_combineLoader(config.map[key], module, key, dataMap[key]);
		}
		catch (e)
		{
			console.error('Error in module ' + module);
			console.error(e);
		}
	}
}


/**
 * @param {string=} root
 * @param {boolean=false} isVirtual
 */
function builder(root, isVirtual)
{
	var file;
	var config = { map: {} };
	
	isVirtual	= isVirtual || false;
	root		= root || Root.path();
	
	configSearch(root, 
		(module, data) => 
		{
			_combineMain(config, module, data);
		},
		(module, error) => 
		{
			console.error('Error when reading namespace.json in module ' + module + '. Skipping...', error);
		});
	
	if (!isVirtual)
	{
		file = new ApplicationConfigFile(root);
		file.save(config);
	}
	
	return config;
}


module.exports = builder;