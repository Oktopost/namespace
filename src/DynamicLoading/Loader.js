'use strict';


const Root = require('../Setup/Root');
const NamespaceCouldNotBeLoadedException = require('./NamespaceCouldNotBeLoadedException');


function Loader()
{
	this._map = {};
}


/**
 * @param {{}} map
 */
Loader.prototype.add = function (map)
{
	for (var attr in map)
	{
		if (!map.hasOwnProperty(attr))
			continue;
		
		if (this._map.hasOwnProperty(attr))
			throw new Error('Loader for ' + attr + ' already defined');
		
		this._map[attr] = map[attr];
	}
};

/**
 * @param {string} namespace
 * @return {string}
 */
Loader.prototype.resolve = function (namespace)
{
	var res = this.tryResolve(namespace);
	
	if (res === null)
		throw new NamespaceCouldNotBeLoadedException(namespace);
	
	return res;
};

/**
 * @param {string} p
 * @return {string}
 * @private
 */
Loader.prototype._resolveToFullPath = function (p)
{
	if (p !== null && p.substr(0, 2) === './')
	{
		p = Root.path() + '/' + p.substr(2);
	}
	
	return p;
};

/**
 * @param {string} namespace
 * @return {string|null}
 */
Loader.prototype.tryResolve = function (namespace)
{
	//noinspection JSUnusedAssignment
	var bestMatchResolver	= null;
	var bestMatch			= 0;
	
	for (var attr in this._map)
	{
		if (!this._map.hasOwnProperty(attr) ||
				
			// Will cover most cases
			attr[0] !== namespace[0] ||
				
			// Best match already found
			attr.length <= bestMatch ||
				
			// Check if namespace matches prefix.
			attr.length > namespace.length || 
			namespace.substr(0, attr.length) !== attr) 
		{
			continue;
		}
		
		bestMatchResolver = this._map[attr];
		bestMatch = attr.length;
	}
	
	return (bestMatchResolver === null ? 
		null : 
		this._resolveToFullPath(bestMatchResolver(namespace))
	);
};

/**
 * @param {string} namespace
 * @return {*}
 */
Loader.prototype.get = function (namespace)
{
	var p = this.resolve(namespace);
	return require(p);
};

/**
 * @param {string} namespace
 * @return {*|null}
 */
Loader.prototype.tryGet = function (namespace)
{
	try 
	{
		return this.get(namespace);
	}
	catch (e) 
	{
		if (e instanceof NamespaceCouldNotBeLoadedException || e.code === 'MODULE_NOT_FOUND')
			return null;
		else 
			throw e;
	}
};

/**
 * @return {Loader}
 */
Loader.instance = function ()
{
	if (typeof Loader._instance === 'undefined')
		Loader._instance = new Loader();
	
	return Loader._instance 
};


module.exports = Loader;