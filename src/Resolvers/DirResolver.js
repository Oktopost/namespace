const fs = require('fs');
const path = require('path');

const AbstractResolver = require('./AbstractResolver');
const NamespaceException = require('./../Exceptions/NamespaceException');


function DirResolver()
{
	AbstractResolver.call(this);
	
	this._files = {};
	this._cache = {};
}


DirResolver.prototype = Object.create(AbstractResolver.prototype);
DirResolver.prototype.constructor = DirResolver;


DirResolver.prototype._resetCache = function ()
{
	this._cache = {};
};

/**
 * @return {[string]|string}
 */
DirResolver.prototype.getConfigPrefix = function ()
{
	return ['dir', 'directory'];
};

/**
 * @param {string} folder
 * @param {{}} config
 */
DirResolver.prototype.parseConfig = function (folder, config)
{
	for (var partialName in config)
	{
		var dir = config[partialName];
		
		if (typeof this._files[partialName] !== 'undefined')
			throw new NamespaceException(`A path for partial namespace [${partialName}] is already defined`);
		
		dir = path.resolve(folder, dir);
		
		this._files[partialName] = dir;
	}
	
	this._resetCache();
};

DirResolver.prototype.isValidFile = function (fullName)
{
	var file = this.getFilePath(fullName);
	return file ? fs.existsSync(file) : false;
};

DirResolver.prototype.isValidPath = function (fullName)
{
	for (var partialName in this._files)
	{
		if (fullName.indexOf(partialName) === 0)
			return true;
	}
	
	return false;
};

DirResolver.prototype.getFilePath = function (fullName)
{
	if (typeof this._cache[fullName] !== 'undefined')
		return this._cache[fullName];
	
	var found = '';
	var file = null;
	
	for (var partialName in this._files) 
	{
		if (partialName.length > found.length && fullName.indexOf(partialName) === 0)
		{
			found = partialName;
		}
	}
	
	if (found.length > 0)
	{
		file = fullName.substr(found.length);
		
		if (file[0] === '.')
			file = file.substr(1);
		
		file = file.replace('.', path.sep);
		file = path.resolve(this._files[found], file);
		file += '.js';
	}
	
	this._cache[fullName] = file;
	
	return this._cache[fullName];
};


module.exports = DirResolver;