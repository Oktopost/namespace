'use strict';


const ProxyPreset = require('./ProxyPreset');


/**
 * @param {Cursor} cursor
 * @param {function(Cursor, string, *): *} setter
 * @param {function(Cursor, string): *} getter
 * @constructor
 */
function ProxyHandler(cursor, setter, getter)
{
	this._handler	= null;
	this._setter	= setter || (() => {});
	this._getter	= getter;
	this._cursor	= cursor;
	
	this._handler = ProxyPreset.merge({
		get: this._get.bind(this),
		set: this._set.bind(this)
	});
}


ProxyHandler.prototype._get = function (target, name)
{
	if (typeof target[name] === 'undefined')
	{
		var res = this._getter(this._cursor, name);
		
		if (typeof res === 'undefined')
			throw new Error('Could not find property ' + name + ' inside namespace <' + this._cursor.fullName + '>');
		
		target[name] = res;
	}
	
	return target[name]; 
};

ProxyHandler.prototype._set = function (target, name, value)
{
	if (typeof target[name] !== 'undefined')
	{
		throw new Error('Element with the name ' + name + 
			' already exists inside the namespace <' + this._cursor.fullName + '>');
	}
	
	var override = this._setter(this._cursor, name, value);
	target[name] = override || value;
	
	return true;
};


/**
 * @return {{}}
 */
ProxyHandler.prototype.handler = function ()
{
	return this._handler;
};


module.exports = ProxyHandler;