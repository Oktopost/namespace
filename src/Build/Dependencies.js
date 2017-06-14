'use strict';


const SyncFS = require('./Crawl/SyncFS');
const orderDependencies = require('./Order/orderDependencies');


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


module.exports = Dependencies;