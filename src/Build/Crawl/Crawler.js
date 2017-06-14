'use strict';


const fs = require( 'fs' );


function Crawler(onDependency)
{
	this._onComplete	= null;
	this._onError		= null;
	this._onDependency	= onDependency || ((path) => { require(path); });
}


Crawler.prototype._invokeComplete = function ()
{
	if (this._onComplete)
	{
		this._onComplete();
	}
};

/**
 * @param {*} error
 */
Crawler.prototype._invokeError = function (error)
{
	if (this._onError)
	{
		this._onError(error);
	}
	else
	{
		throw error;
	}
};


/**
 * @param {callback} callback
 * @return {SyncFS}
 */
Crawler.prototype.onComplete = function (callback)
{
	this._onComplete = callback;
	return this;
};

/**
 * @param {callback} callback
 * @return {SyncFS}
 */
Crawler.prototype.onError = function (callback)
{
	this._onError = callback;
	return this;
};

/**
 * @param {string} path
 */
Crawler.prototype.scan = function (path)
{
	var self = this;
	
	try
	{
		var result = this._doScan(path);
		
		if (result instanceof Promise)
		{
			result
				.then(function () { self._invokeComplete(); })
				.catch(function () { self._invokeError(); });
		}
		else if (result === true)
		{
			this._invokeComplete();
		}
	}
	catch (error)
	{
		this._invokeError(error);
	}
};


module.exports = Crawler;