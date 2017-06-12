'use strict';


/**
 * @param {Loader} loader
 * @constructor
 */
function GetFromLoader(loader)
{
	this._loader = loader;
}


/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {function} callback
 */
GetFromLoader.prototype.get = function (cursor, name, callback)
{
	var fullName	= cursor.getFullPathForChild(name);
	var res			= this._loader.tryGet(fullName);
	
	return res === null ? callback() : res;
};


module.exports = GetFromLoader;