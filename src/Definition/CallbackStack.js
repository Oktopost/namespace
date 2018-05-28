const NamespaceException = require('../Exceptions/NamespaceException');


function CallbackStack()
{
	this._isInitialized = false;
	this._originalNamespace = null;
	
	this._currentItems = null;
	this._itemsStack = [];
}


CallbackStack.prototype._getNamespaceFunction = function ()
{
	var self = this;
	
	return function (name, callback)
	{
		if (!callback)
			throw new NamespaceException('Namespace definition callback was not passed!');
		
		var func = function (name, callback)
		{
			callback.call(
				self._currentItems.thisProxy.getProxy(), 
				self._currentItems.rootProxy.getObject());
		};
		
		return self._currentItems.definitionCallback(
			name,
			callback,
			func.bind(self));
	};
};


CallbackStack.prototype.initialize = function ()
{
	if (this._isInitialized)
		throw new NamespaceException('CallbackStack already initialized');
	
	this._isInitialized = true;
	
	if (global.namespace)
		this._originalNamespace = global.namespace;
	
	global.namespace = this._getNamespaceFunction();
};

CallbackStack.prototype.destroy = function ()
{
	if (!this._isInitialized)
		throw new NamespaceException('CallbackStack was not initialized');
	
	this._isInitialized = false;
	
	if (this._originalNamespace)
		global.namespace = this._originalNamespace;
	
	this._originalNamespace = null;
};

/**
 * @param {{thisProxy: DefinitionProxy, rootProxy: RootProxy, definitionCallback}} items
 */
CallbackStack.prototype.pushStack = function (items)
{
	if (this._itemsStack.length === 0)
		this.initialize();
	
	this._currentItems = items;
	this._itemsStack.push(items);
};

CallbackStack.prototype.popStack = function ()
{
	if (this._itemsStack.length <= 1)
	{
		this._itemsStack = [];
		this._currentItems = null;
		this.destroy();
	}
	else
	{
		this._currentItems = this._itemsStack.pop();
	}
};


module.exports = CallbackStack;