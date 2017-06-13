'use strict';


const path 	= require('path');
const fs	= require('fs');


const FILE_NAME = 'namespace.json';


/**
 * @param {string} dir
 * @constructor
 */
function ApplicationConfigFile(dir)
{
	this._dir = dir;
	this._file = path.join(dir, FILE_NAME);
}


/**
 * @param {{}} data
 */
ApplicationConfigFile.prototype.save = function (data)
{
	fs.writeFileSync(this._file, JSON.stringify(data, null, '\t'), 'utf8');
};

/**
 * @return {{}|null}
 */
ApplicationConfigFile.prototype.load = function ()
{
	if (fs.existsSync(this._file))
	{
		return JSON.parse(fs.readFileSync(this._file));
	}
	
	return null;
};

/**
 * @return {boolean}
 */
ApplicationConfigFile.prototype.isExists = function ()
{
	return fs.existsSync(this._file);
};

ApplicationConfigFile.prototype.delete = function ()
{
	if (this.isExists())
	{
		fs.unlinkSync(this._file);
	}
};


module.exports = ApplicationConfigFile;