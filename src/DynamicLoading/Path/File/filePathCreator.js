'use strict';


const filePath = require('./filePath');


/**
 * @param {string} key
 * @param {string} path
 * @return {function(string, string, string): string}
 */
module.exports = function filePathCreator(key, path)
{
	if (typeof path !== 'string')
		throw new Error('Configuration Value for partial must be a plain string');
	
	return function ()
	{
		return filePath(path);
	}
};