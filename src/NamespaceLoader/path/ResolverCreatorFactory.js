'use strict';


const partialCreator			= require('./partial/partialCreator');
const directoryResolveCreator	= require('./directory/directoryResolveCreator');


const INITIAL_MAP = {
	dir:		directoryResolveCreator,
	directory:	directoryResolveCreator,
	partial:	partialCreator
};


function ResolverCreatorFactory()
{
	this._map = {};
}


/**
 * @param {string|{}} key
 * @param {function(string, *): Function=} loader
 */
ResolverCreatorFactory.prototype.register = function (key, loader)
{
	if (typeof loader === 'function' && typeof key === 'string')
	{
		if (typeof this._map[key] !== 'undefined')
		{
			throw new Error('Loader for the type ' + key + ' is already defined!');
		}
		
		this._map[key] = loader;
	}
	else
	{
		for (var attr in key)
		{
			if (key.hasOwnProperty(attr))
			{
				this.register(attr, key[attr]);
			}
		}
	}
};


/**
 * @param {string} key
 * @return {function(string, *): Function}
 */
ResolverCreatorFactory.prototype.getCreator = function (key)
{
	if (typeof this._map[key] === 'undefined')
	{
		throw new Error('There is no namespace loader defined for type ' + key);
	}
	
	return this._map[key];
};

ResolverCreatorFactory.prototype.clone = function ()
{
	var clone = new ResolverCreatorFactory();
	clone.register(this._map);
	return clone;
};


/**
 * @param {string} key
 * @return {function(string, *): Function}
 */
ResolverCreatorFactory.getCreator = function (key)
{
	return ResolverCreatorFactory.instance().getCreator(key);
};

/**
 * @return {ResolverCreatorFactory}
 */
ResolverCreatorFactory.instance = function () 
{
	if (typeof ResolverCreatorFactory._instance === 'undefined')
	{
		ResolverCreatorFactory._instance = new ResolverCreatorFactory();
		ResolverCreatorFactory._instance.register(INITIAL_MAP);
	}
	
	return ResolverCreatorFactory._instance;
};


module.exports = ResolverCreatorFactory;