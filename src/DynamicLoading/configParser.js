'use strict';


const ResolverCreatorFactory = require('./Path/ResolverCreatorFactory');



function _parseCreator(creator, config, result)
{
	for (var key in config)
	{
		if (!config.hasOwnProperty(key)) continue;
		
		if (typeof result[key] !== 'undefined')
		{
			throw new Error('Namespace loading strategy is already defined for prefix ' + key);
		}
		
		result[key] = creator(key, config[key]);
	}
}

/**
 * 
 * @param {{}} config
 * @param {ResolverCreatorFactory=} factory
 * @return {{}}
 */
function configParser(config, factory)
{
	var result = {};
	var resolveCreator;
	
	factory = factory || ResolverCreatorFactory.instance();
		
	for (var key in config)
	{
		if (!config.hasOwnProperty(key)) continue;
		
		resolveCreator = factory.getCreator(key);
		_parseCreator(resolveCreator, config[key], result)
	}
	
	return result;
}


module.exports = configParser;