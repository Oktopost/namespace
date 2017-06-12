'use strict';


/**
 * @constructor
 */
function DependencyLogger()
{
	this._current 		= undefined;
	this._stuck			= [];
	this._dependencies	= [];
}


/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {function} callback
 */
DependencyLogger.prototype.get = function (cursor, name, callback)
{
	this._current = cursor.getFullPathForChild(name);
	this._stuck.push(this._current);
	
	try
	{
		return callback();
	}
	finally 
	{
		this._stuck.pop(); 
	}
};


/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {*} value
 * @param {function} callback
 */
DependencyLogger.prototype.set = function (cursor, name, value, callback)
{
	if (typeof this._dependencies[this._current] === 'undefined')
	{
		this._dependencies[this._current] = [];
	}
	
	this._dependencies[this._current].push(cursor.getFullPathForChild(name))
	
	return callback();
};


module.exports = DependencyLogger;