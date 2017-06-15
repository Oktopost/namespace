'use strict';


/**
 * @param {function(string)} onCalled
 * @param {*} target
 * @param {string} fullName
 * @return {Proxy}
 */
function getProxy(onCalled, target, fullName)
{
	return new Proxy(
		target,
		{
			get: function (target, name)
			{
				if (typeof name !== 'symbol' && name !== 'inspect' && name !== 'prototype')
				{
					onCalled((fullName.length > 0 ? fullName + '.' + name : name));
				}
				
				return target[name];
			}
		});
}


/**
 * @constructor
 */
function DependencyLogger()
{
	this._current 		= '';
	this._callStack		= [];
	this._currentDep	= [];
	this._depStack		= [];
	this._dependencies	= {};
	this._all			= {};
	
	this._onGetFromProxy = this._onGetFromProxy.bind(this)
}


/**
 * @param {string} fullName
 * @private
 */
DependencyLogger.prototype._push = function (fullName)
{
	this._callStack.push(this._current);
	this._current = fullName;
	
	this._depStack.push(this._currentDep);
	this._currentDep = [];
};

/**
 * @param {string} fullName
 * @return {boolean}
 * @private
 */
DependencyLogger.prototype._isDefined = function(fullName)
{
	return typeof this._all[fullName] !== 'undefined';
};

DependencyLogger.prototype._pop = function ()
{
	var lastElement = this._current;
	var lastDep = this._currentDep;
	
	this._current = this._callStack.pop();
	this._currentDep = this._depStack.pop();
	
	if (this._isDefined(lastElement))
	{
		this._dependencies[lastElement] = (typeof this._dependencies[lastElement] === 'undefined' ? 
			lastDep : 
			this._dependencies[lastElement].concat(lastDep));
	}
	else
	{
		this._currentDep = this._currentDep.concat(lastDep);
	}
};


DependencyLogger.prototype._onGetFromProxy = function (fullName)
{
	if (this._isDefined(fullName))
	{
		this._currentDep.push(fullName);
	}
};


/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {function} callback
 */
DependencyLogger.prototype.get = function (cursor, name, callback)
{
	var fullName = cursor.getFullName(name);
	
	this._push(fullName);
	
	var res = callback();
	
	if (typeof this._all[fullName] === 'undefined')
	{
		res = getProxy(this._onGetFromProxy, res, fullName);
		cursor.head[name] = res;
	}
	
	this._pop();
	
	return res;
};

/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {*} value
 * @param {function} callback
 */
DependencyLogger.prototype.set = function (cursor, name, value, callback)
{
	var fullName = cursor.getFullName(name);
	this._all[fullName] = true;
	
	if (fullName !== this._current)
	{
		this._currentDep.push(fullName);
	}
	else
	{
		this._depStack[this._depStack.length - 1].push(fullName);
	}
	
	return callback();
};

/**
 * @return {{}}
 */
DependencyLogger.prototype.getDependenciesMap = function () 
{
	return this._dependencies;
};


module.exports = DependencyLogger;