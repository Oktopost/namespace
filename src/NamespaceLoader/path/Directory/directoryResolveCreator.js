'use strict';


const directoryPathResolver = require('./directoryPathResolver');


/**
 * @param {string} key
 * @param {string} directory
 * @return {function(string, string, string): string}
 */
module.exports = function directoryResolveCreator(key, directory)
{
	if (typeof directory !== 'string')
		throw new Error('Configuration Value for directory must be a plain string');
	
	return function (namespace)
	{
		return directoryPathResolver(directory, namespace); 
	}
};