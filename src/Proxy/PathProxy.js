const GenericPathProxy = require('./GenericPathProxy');


/**
 * @param {{onGet: function, onReference: function}} callbacks
 * @param {PathProxy=null} parent
 * @param {string} name
 * @constructor
 */
function PathProxy(callbacks, parent, name)
{
	GenericPathProxy.call(this, callbacks, parent, name);
}


PathProxy.prototype = Object.create(GenericPathProxy.prototype);
PathProxy.prototype.constructor = PathProxy;


PathProxy.prototype._invokeOnReference = function ()
{
	if (this._value === null) 
		this._callback.onReference(this);
};


PathProxy.prototype._getChildProxy = function (name)
{
	return new PathProxy(this._callback, this, name);
};

PathProxy.prototype._getProxy = function ()
{
	if (!this._proxy)
	{
		this._proxy = new Proxy(
			this._children,
			{
				set:						this._onSet.bind(this),
				get:						this._onGet.bind(this),
				apply:						this._onApply.bind(this),
				construct:					this._onConstruct.bind(this),
				defineProperty:				this._onDefineProperty.bind(this),
				deleteProperty:				this._onDeleteProperty.bind(this),
				has:						this._onHas.bind(this),
				isExtensible:				this._onIsExtensible.bind(this),
				preventExtensions:			this._onPreventExtensions.bind(this),
				setPrototypeOf:				this._onSetPrototypeOf.bind(this),
				getOwnPropertyDescriptor:	this._onGetOwnPropertyDescriptor.bind(this)
			}
		)
	}
	
	return this._proxy;
};


PathProxy.prototype._onSet = function(obj, name, value)
{
	this._invokeOnReference();
	return Reflect.set(this._value, name, value)
};

PathProxy.prototype._onApply = function(target, thisArg, argumentsList)
{
	this._invokeOnReference();
	return this._value.call(thisArg, argumentsList);
};

PathProxy.prototype._onConstruct = function(target, args)
{
	this._invokeOnReference();
	return new this._value(...args);
};

PathProxy.prototype._onDefineProperty = function(target, key, descriptor)
{
	this._invokeOnReference();
	return Reflect.defineProperty(this._value, key, descriptor);
};

PathProxy.prototype._onDeleteProperty = function(target, prop)
{
	this._invokeOnReference();
	return delete this._value[prop];
};

PathProxy.prototype._onHas = function(target, key)
{
	this._invokeOnReference();
	return key in this._value;
};

PathProxy.prototype._onIsExtensible = function()
{
	this._invokeOnReference();
	return Reflect.isExtensible(this._value);
};

PathProxy.prototype._onPreventExtensions = function()
{
	this._invokeOnReference();
	return Reflect.preventExtensions(this._value);
};

PathProxy.prototype._onSetPrototypeOf = function(target, prototype)
{
	this._invokeOnReference();
	return Reflect.setPrototypeOf(this._value, prototype);
};

PathProxy.prototype._onGetOwnPropertyDescriptor = function(target, k)
{
	this._invokeOnReference();
	return Reflect.getOwnPropertyDescriptor(this._value, k);
};


PathProxy.prototype.hasValue = function ()
{
	return this._value !== null;
};

PathProxy.prototype.setValue = function (val)
{
	this._value = val;
	
	for (var key in this._children)
	{
		if (!this._children.hasOwnProperty(key))
			continue;
		
		var childValue = (typeof val === 'undefined' ? undefined : val[key]);
		this._children[key].setValue(childValue);
	}
	
	this._children = null;
};


module.exports = PathProxy;