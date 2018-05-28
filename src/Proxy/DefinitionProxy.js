/**
 * @param {function(string, object)} onSet
 * @constructor
 */
function DefinitionProxy(onSet)
{
	this._obj			= {};
	this._proxy			= null;
	this._onSetCallback = onSet;
}


DefinitionProxy.prototype._onSet = function (obj, name, value)
{
	this._obj[name] = this._onSetCallback(name, value);
};


DefinitionProxy.prototype.getProxy = function ()
{
	if (!this._proxy)
	{
		this._proxy = new Proxy(
			this._obj,
			{
				set: this._onSet.bind(this)
			}
		)
	}
	
	return this._proxy;
};


module.exports = DefinitionProxy;