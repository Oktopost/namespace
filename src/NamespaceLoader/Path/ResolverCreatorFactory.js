'use strict';


const partialCreator			= require('./Partial/partialCreator');
const directoryResolveCreator	= require('./Directory/directoryResolveCreator');

const pathPayloadToRelativePath	= require('./Base/pathPayloadToRelativePath');


const INITIAL_MAP = {
	dir:		directoryResolveCreator,
	directory:	directoryResolveCreator,
	partial:	partialCreator
};

const INITIAL_PATH_CALLBACKS = {
	dir:		pathPayloadToRelativePath,
	directory:	pathPayloadToRelativePath,
	partial:	pathPayloadToRelativePath
};


function ResolverCreatorFactory()
{
	this._map = {};
	this._path = {};
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
 * @param {function(string, *): string=} pathResolveCallback
 */
ResolverCreatorFactory.prototype.registerPathCallback = function (key, pathResolveCallback)
{
	if (typeof pathResolveCallback === 'function' && typeof key === 'string')
	{
		if (typeof this._path[key] !== 'undefined')
		{
			throw new Error('Path resolve callback for the type ' + key + ' is already defined!');
		}
		
		this._path[key] = pathResolveCallback;
	}
	else
	{
		for (var attr in key)
		{
			if (key.hasOwnProperty(attr))
			{
				this.registerPathCallback(attr, key[attr]);
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

/**
 * @param {string} key
 * @return {function(string, *): string}
 */
ResolverCreatorFactory.prototype.getPathResolveCallback = function (key)
{
	if (typeof this._path[key] === 'undefined')
	{
		throw new Error('There is no path resolve callback registered for type ' + key);
	}
	
	return this._path[key];
};

/**
 * @return {ResolverCreatorFactory}
 */
ResolverCreatorFactory.prototype.clone = function ()
{
	var clone = new ResolverCreatorFactory();
	clone.register(this._map);
	clone.registerPathCallback(this._path);
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
 * @param {string} key
 * @return {function(string, *): string}
 */
ResolverCreatorFactory.getPathResolveCallback = function (key)
{
	return ResolverCreatorFactory.instance().getPathResolveCallback(key);
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
		ResolverCreatorFactory._instance.registerPathCallback(INITIAL_PATH_CALLBACKS);
	}
	
	return ResolverCreatorFactory._instance;
};


module.exports = ResolverCreatorFactory;