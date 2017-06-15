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
	var fullName	= cursor.getFullName(name);
	var res			= this._loader.tryGet(fullName);
	
	if (res === null)
	{
		return callback();
	}
	else if (typeof cursor.head[name] !== 'undefined')
	{
		return cursor.head[name]
	}
	else
	{
		return res;
	}
};


module.exports = GetFromLoader;