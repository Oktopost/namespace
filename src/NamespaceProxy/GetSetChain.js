'use strict';


const ChainCall = require('./ChainCall');


/**
 * @param {function|{}=} initial
 * @constructor
 */
function GetSetChain(initial)
{
	this._getChain = new ChainCall();
	this._setChain = new ChainCall();
	
	if (typeof initial !== 'undefined')
		this.add(initial);
}


/**
 * @param {function|*} data
 * @param {function=} set
 */
GetSetChain.prototype.add = function (data, set)
{
	if (data instanceof Array)
	{
		for (var i = data.length - 1; i >= 0; i--)
		{
			this.add(data[i]);
		}
	}
	else if (data instanceof Function )
	{
		this._getChain.add(data);
	}
	else if (data instanceof Object)
	{
		if (typeof data['set'] === 'function')
		{
			this._setChain.add(data['set'].bind(data));
		}
		
		if (typeof data['get'] === 'function')
		{
			this._getChain.add(data['get'].bind(data));
		}
	}
	
	if (set instanceof Function || set instanceof Array)
	{
		this._setChain.add(set);
	}
	
	return this;
};


/**
 * @return {function(this:ChainCall)}
 */
GetSetChain.prototype.getterCallback = function ()
{
	return this._getChain.getInvokeCallback();
};

/**
 * @return {function(this:ChainCall)}
 */
GetSetChain.prototype.setterCallback = function ()
{
	return this._setChain.getInvokeCallback();
};


module.exports = GetSetChain;