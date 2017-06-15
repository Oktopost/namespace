'use strict';


const Root = require('../Setup/Root');
const orderDependencies = require('./Order/orderDependencies');

const Loader = require('../DynamicLoading/Loader');


/**
 * @param {DependencyLogger} logger
 * @constructor
 */
function Dependencies(logger) 
{
	this._logger = logger;
}


/**
 * @return {Array.<string>}
 */
Dependencies.prototype.get = function ()
{
	return orderDependencies(this._logger.getDependenciesMap());
};

/**
 * @return {Array.<string>}
 */
Dependencies.prototype.getResolved = function ()
{
	var ordered		= this.get();
	var resolved	= [];
	
	for (var i = 0; i < ordered.length; i++)
	{
		resolved.push(Loader.instance().resolve(ordered[i]));
	}
	
	return resolved;
};

/**
 * @return {Array.<string>}
 */
Dependencies.prototype.getResolvedToRoot = function ()
{
	var resolved = this.getResolved();
	var rootPathLength = Root.path().length;
	
	for (var i = 0; i < resolved.length; i++)
	{
		if (resolved[i][0] === '/')
		{
			resolved[i] = resolved[i].substr(rootPathLength + 1); 
		}
		else
		{
			resolved[i] = 'node_modules/' + resolved[i];
		}
		
		resolved[i] += '.js';
	}
	
	return resolved;
};


module.exports = Dependencies;