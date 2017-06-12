'use strict';


const partialPath = require('./partialPath');


/**
 * @param {string} key
 * @param {string} path
 * @return {function(string, string, string): string}
 */
module.exports = function partialCreator(key, path)
{
	if (typeof path !== 'string')
		throw new Error('Configuration Value for partial must be a plain string');
	
	return function (namespace)
	{
		return partialPath(key, path, namespace); 
	}
};