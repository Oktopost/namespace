const path = require('path');


/**
 * @param {string} fullPath
 * @constructor
 */
function File(fullPath)
{
	this._fullPath		= fullPath;
	this._name			= path.basename(fullPath);
	this._definitions	= [];
}


File.prototype.fullPath = function ()
{
	return this._fullPath;
};

File.prototype.name = function ()
{
	return this._name;
};

/**
 * @param {NamespaceDefinition} definition
 */
File.prototype.addDefinition = function (definition)
{
	this._definitions.push(definition)
};


module.exports = File;