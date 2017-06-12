'use strict';


const Consts = require('./Consts');


function ProxyObject()
{
	this._get = this._get.bind(this);
	
	
	this._source	= null;
	this._proxy		= null;
	this._target	= {};
	this._stop		= false;
	this._handler	= { get: this._get };
	
	this._source	= this._createSource();
	this._proxy		= this._createProxy(this._source, '', '');
}


ProxyObject.prototype._createSource = function ()
{
	return function() {};
};

ProxyObject.prototype._createProxy = function (source, path, name)
{
	var proxy = new Proxy(source, this._handler);
	proxy[Consts.PATH] = (path.length === 0 ? name : path + Consts.NAMESPACE_SEPARATOR + name);
	return proxy
};

ProxyObject.prototype._createNewProxy = function (path, name)
{
	return this._createProxy(this._createSource(), path, name);
};

ProxyObject.prototype._get = function (target, name)
{
	if (name === 'prototype')
	{
		return {};
	}
	else if (target.hasOwnProperty(name))
	{
		return target[name];
	}
	else if (typeof name !== 'string' || this._stop)
	{
		return;
	}
	
	target[name] = this._createNewProxy(target[Consts.PATH], name);
	return target[name];
};


ProxyObject.prototype.stop = function ()
{
	this._stop = true;
};

ProxyObject.prototype.proxy = function ()
{
	return this._proxy;
};

ProxyObject.prototype.source = function ()
{
	return this._source;
};

ProxyObject.prototype.target = function ()
{
	return this._target;
};


module.exports = ProxyObject;