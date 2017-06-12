'use strict';


function ChainCall(initial)
{
	this._chain = [];
	
	
	if (initial)
	{
		this.add(initial);
	}
}


/**
 * @param {function|[function]} set
 * @return {ChainCall}
 */
ChainCall.prototype.add = function (set)
{
	if (set instanceof Array)
	{
		for (var i = set.length - 1; i >= 0; i--)
		{
			this.add(set[i]);
		}
	}
	else if (set instanceof Function)
	{
		this._chain = [set].concat(this._chain);
	}
	else
	{
		throw new Error('Unexpected parameter type!');
	}
	
	return this;
};

/**
 * @param {function|[function]} set
 * @return {ChainCall}
 */
ChainCall.prototype.addToEnd = function (set)
{
	if (set instanceof Array)
	{
		for (var i = 0; i < set.length; i++)
		{
			this.addToEnd(set[i]);
		}
	}
	else if (set instanceof Function)
	{
		this._chain = this._chain.concat([set]);
	}
	else
	{
		throw new Error('Unexpected parameter type!');
	}
	
	return this;
};

/**
 * @return {*|}
 */
ChainCall.prototype.invoke = function ()
{
	var headCallback = () => {};
	var arg = Array.prototype.slice.call(arguments);
	
	for (var chainIndex = this._chain.length - 1; chainIndex >= 0; chainIndex--)
	{
		var creator = ((current, arg) => 
		{
			return () => current.apply(null, arg);
		});
		
		headCallback = creator(this._chain[chainIndex], arg.concat(headCallback));
	}
	
	return headCallback(); 
};

/**
 * @return {function(this:ChainCall)}
 */
ChainCall.prototype.getInvokeCallback = function ()
{
	return this.invoke.bind(this);
};


module.exports = ChainCall;