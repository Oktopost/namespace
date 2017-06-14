'use strict';


function OrderedContainer()
{
	this._map = {};
	this._ordered = [];
	this._newStack = [];
}


/**
 * @return {Array.<string>}
 */
OrderedContainer.prototype.getOrdered = function ()
{
	return this._ordered.concat();
};

/**
 * @param {string} name
 * @return {boolean}
 */
OrderedContainer.prototype.has = function (name)
{
	return typeof this._map[name] !== 'undefined';
};

/**
 * @param {string} name
 */
OrderedContainer.prototype.add = function (name)
{
	if (!this.has(name))
	{
		this._map[name] = true;
		this._newStack.push(name);
	}
};

OrderedContainer.prototype.apply = function ()
{
	this._newStack.sort();
	this._ordered = this._ordered.concat(this._newStack);
	this._newStack = [];
};

/**
 * @return {Number}
 */
OrderedContainer.prototype.count = function ()
{
	return this._ordered.length;
};


module.exports = OrderedContainer;