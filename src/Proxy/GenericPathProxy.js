const NamespaceException = require('../Exceptions/NamespaceException');


/**
 * @param {{onGet: function, onReference: function}} callbacks
 * @param {PathProxy=null} parent
 * @param {string} name
 * @constructor
 */
function GenericPathProxy(callbacks, parent, name)
{
	this._callback	= callbacks;
	this._fullName	= parent ? parent.getFullNameTo(name) : name;
	this._name		= name;
	this._parent	= parent;
	
	this._children	= {};
	this._value		= null;
}


/**
 * @param {string} name
 * @return {{name: string, fullName: string, proxy: (PathProxy|null), parent: (PathProxy|null)}}
 * @protected
 */
GenericPathProxy.prototype._getParamsObject = function (name)
{
	var fullName	= this.getFullNameTo(name);
	var proxy		= this._getChildProxy(name);
	
	return {
		name:		name,
		fullName:	fullName,
		proxy:		proxy,
		parent: 	proxy.getParent()
	};
};

/**
 * @param {string} name
 * @return {PathProxy|null}
 * @protected
 */
GenericPathProxy.prototype._getChildProxy = function (name)
{
	throw new NamespaceException('Not implemented');
};

/**
 * @param {*} target
 * @param {string} name
 * @return {*}
 * @protected
 */
GenericPathProxy.prototype._onGet = function (target, name)
{
	if (this._value	!== null)
		return this._value[name];
	else if (typeof this._children[name] !== 'undefined')
		return this._children[name];
	
	var params = this._getParamsObject(name);
	var result = this._callback.onGet(params);
	
	result = result || params.proxy;
	this._children[name] = result;
	
	return result;
};


/**
 * @param {string} name
 * @return {string}
 */
GenericPathProxy.prototype.getFullNameTo = function (name)
{
	return (this._fullName.length > 0 ? this._fullName + '.' + name : name);
};

/**
 * @return {PathProxy|null}
 */
GenericPathProxy.prototype.getParent = function ()
{
	return this._parent;
};

/**
 * @return {string}
 */
GenericPathProxy.prototype.getFullName = function ()
{
	return this._fullName;
};

/**
 * @return {string}
 */
GenericPathProxy.prototype.getName = function ()
{
	return this._name;
};

GenericPathProxy.prototype.getObject = function ()
{
	throw new NamespaceException('Not implemented');
};


module.exports = GenericPathProxy;