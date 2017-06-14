'use strict';


/**
 * @constructor
 */
function DependencyLogger()
{
	this._current 		= '';
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
	this._stuck.push(this._current);
	this._current = cursor.getFullPathForChild(name);
	
	try
	{
		return callback();
	}
	finally 
	{
		this._current = this._stuck.pop();
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
	
	var fullName = cursor.getFullPathForChild(name);
	
	if (fullName !== this._current)
	{
		this._dependencies[this._current].push(cursor.getFullPathForChild(name));
	}
	
	return callback();
};


module.exports = DependencyLogger;