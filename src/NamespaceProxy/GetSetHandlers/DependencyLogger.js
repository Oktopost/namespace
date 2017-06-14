'use strict';


/**
 * @constructor
 */
function DependencyLogger()
{
	this._current 		= '';
	this._currentStack	= [];
	this._depsStack		= [];
	this._stack			= [];
	this._dependencies	= {};
	this._all			= {};
}


/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {function} callback
 */
DependencyLogger.prototype.get = function (cursor, name, callback)
{
	var fullName = cursor.getFullPathForChild(name);
	
	if (typeof this._all[fullName] !== 'undefined')
	{
		this._currentStack.push(fullName);
	}
	
	this._stack.push(this._current);
	this._depsStack.push(this._currentStack);
	
	this._current = cursor.getFullPathForChild(name);
	this._currentStack = [];
	
	return callback();
};

/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {*} value
 * @param {function} callback
 */
DependencyLogger.prototype.set = function (cursor, name, value, callback)
{
	callback();
	
	var fullName = cursor.getFullPathForChild(name);
	
	this._all[fullName] = true;
	
	while (this._current !== fullName)
	{
		this._current = this._stack.pop();
		this._currentStack = this._depsStack.pop().concat(this._currentStack);
	}
	
	if (typeof this._dependencies[this._current] === 'undefined')
	{
		this._dependencies[this._current] = [];
	}
	
	this._dependencies[this._current] = this._dependencies[this._current].concat(this._currentStack);
	this._currentStack = this._depsStack.pop();
	this._currentStack.push(fullName);
};

/**
 * @return {{}}
 */
DependencyLogger.prototype.getDependenciesMap = function () 
{
	return this._dependencies;
};


module.exports = DependencyLogger;