const path = require('path');

const AbstractResolver = require('./AbstractResolver');
const NamespaceException = require('./../Exceptions/NamespaceException');


function SingleFileResolver()
{
	AbstractResolver.call(this);
	
	this._files = {};
}


SingleFileResolver.prototype = Object.create(AbstractResolver.prototype);
SingleFileResolver.prototype.constructor = SingleFileResolver;


/**
 * @return {[string]|string}
 */
SingleFileResolver.prototype.getConfigPrefix = function ()
{
	return ['file'];
};

/**
 * @param {string} folder
 * @param {{}} config
 */
SingleFileResolver.prototype.parseConfig = function (folder, config)
{
	for (var fullName in config)
	{
		var file = config[fullName];
		
		if (typeof this._files[fullName] !== 'undefined')
			throw new NamespaceException(`A file for the fullName [${fullName}] is already defined`);
		
		file = path.resolve(folder, file);
		
		this._files[fullName] = file;
	}
};

SingleFileResolver.prototype.isValidFile = function (fullName)
{
	return typeof this._files[fullName] !== 'undefined';
};

SingleFileResolver.prototype.isValidPath = function (fullName)
{
	var search = fullName + '.';
	
	for (var key in this._files)
	{
		if (key.indexOf(search) === 0)
			return true;
	}
	
	return false;
};

SingleFileResolver.prototype.getFilePath = function (fullName)
{
	return this._files[fullName];
};


module.exports = SingleFileResolver;