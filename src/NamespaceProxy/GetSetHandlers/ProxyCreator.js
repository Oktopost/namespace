'use strict';


const ProxyHandler = require('../ProxyHandler'); 


/**
 * @param {GetSetChain} chain
 * @constructor
 */
function ProxyCreator(chain)
{
	this._chain = chain;
}


/**
 * @param {Cursor} cursor
 * @param {string} name
 * @param {function} callback
 */
ProxyCreator.prototype.get = function (cursor, name, callback)
{
	var val = callback();
	
	if (typeof val === 'undefined')
	{
		var handler = new ProxyHandler(
			cursor.createChild(name), 
			this._chain.setterCallback(), 
			this._chain.getterCallback());
		
		val = handler.proxy();
	}

	return val;
};


module.exports = ProxyCreator;