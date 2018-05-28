const PathProxy			= require('./PathProxy');
const GenericPathProxy	= require('./GenericPathProxy');


/**
 * @param {{onGet: function, onReference: function}} callbacks
 * @constructor
 */
function RootProxy(callbacks)
{
	GenericPathProxy.call(this, callbacks, null, '');
	
	this._obj = {};
	
	this._proxy = new Proxy(
		this._obj,
		{
			set: this._onSet.bind(this),
			get: this._onGet.bind(this)
		}
	);
}


RootProxy.prototype = Object.create(GenericPathProxy.prototype);
RootProxy.prototype.constructor = RootProxy;


RootProxy.prototype._onSet = function (obj, name, value)
{
	global[name] = value;
};

RootProxy.prototype._getChildProxy = function (name)
{
	return new PathProxy(this._callback, null, name);
};

RootProxy.prototype._getProxy = function ()
{
	return this._proxy;
};


module.exports = RootProxy;