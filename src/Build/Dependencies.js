'use strict';


const SyncFS = require('./Crawl/SyncFS');
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
	var ordered = this.get();
	var resolved = [];
	
	for (var i = 0; i < ordered.length; i++)
	{
		resolved.push(Loader.instance().resolve(ordered[i]));
	}
	
	return resolved;
};


module.exports = Dependencies;