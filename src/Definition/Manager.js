const RootProxy				= require('./../Proxy/RootProxy');
const DefinitionProxy		= require('./../Proxy/DefinitionProxy');
const InvalidPathException	= require('./../Exceptions/InvalidPathException');

const DefinitionConfig = require('./DefinitionConfig');


/**
 * @param {DefinitionConfig=} config
 * 
 * @property {NamespaceDefinition} _currDefinition
 * @property {PathProxy} _lastProxy
 * 
 * @constructor
 */
function Manager(config)
{
	var scopeProxyCallbacks = {
		onGet:				this._onGetPath.bind(this),
		onReference:		this._onGetElement.bind(this),
		definitionCallback:	this._createDefinition.bind(this)
	};
	
	this._config = config || new DefinitionConfig();
	
	this._lastProxy		= null;
	
	this._file          = null;
	this._currDefObject = null;
	this._thisProxy		= new DefinitionProxy(this._onDefine.bind(this));
	this._rootProxy		= new RootProxy(scopeProxyCallbacks);
}


/**
 * @param {string} fullName
 * @return {NamespaceMember|null}
 * @private
 */
Manager.prototype._findMember = function (fullName)
{
	var member;
	
	if (!this._config.fileResolver.isValidFile(fullName))
		return null;
	
	var file	= this._config.fileResolver.getFilePath(fullName);
	var manager	= new Manager(this._config);
	
	manager.parse(file);
	member = this._config.rootNamespace.getMember(fullName);
	
	return member || null;
};

/**
 * @param {PathProxy} proxy
 * @return {boolean}
 * @private
 */
Manager.prototype._findProxyValue = function (proxy)
{
	var fullName = proxy.getFullName();
	var member = this._findMember(fullName);
	
	if (!member)
		return false;
	
	proxy.setValue(member.value());
	return true;
};

/**
 * @param {PathProxy} proxy
 * @return {boolean}
 * @private
 */
Manager.prototype._findProxyValueRecursive = function (proxy)
{
	var isFound = false;
	
	while (proxy && !isFound)
	{
		if (this._findProxyValue(proxy))
		{
			isFound = true;
			break;
		}
		else
		{
			proxy = proxy.getParent();
		}
	}
	
	if (!isFound)
	{
		throw new InvalidPathException(proxy.getFullName());
	}
};

Manager.prototype._finalizeLastProxy = function ()
{
	if (this._lastProxy)
		return;
	
	this._findProxyValueRecursive(this._lastProxy);
	this._lastProxy = null;
};

/**
 * @param {string} name
 * @param {*} value
 * @return {*}
 * @private
 */
Manager.prototype._onDefine = function (name, value)
{
	this._finalizeLastProxy();
	
	var member = this._currDefObject.createMember(name, value);
	return member.value();
};

/**
 * @param {{name: string, fullName: string, proxy: (PathProxy|null), parent: (PathProxy|null)}} data
 * @return {*}
 * @private
 */
Manager.prototype._onGetPath = function (data)
{
	var resolver = this._config.fileResolver;
	
	if (resolver.isValidPath(data.fullName))
	{
		return null;
	}
	else if (resolver.isValidFile(data.fullName))
	{
		return this._findProxyValueRecursive(data.proxy);
	}
	else
	{
		throw new InvalidPathException(data.fullName);
	}
};

/**
 * @param {PathProxy} proxy
 * @private
 */
Manager.prototype._onGetElement = function (proxy)
{
	if (this._lastProxy !== proxy)
		this._finalizeLastProxy();
	
	this._findProxyValueRecursive(proxy);
};

/**
 * @param {string} name
 * @param {function} callback
 * @param {function(string, function)} next
 * @private
 */
Manager.prototype._createDefinition = function (name, callback, next)
{
	this._finalizeLastProxy();
	
	this._config.debugStack.pushNamespace(name);
	this._currDefObject = this._config.rootNamespace.createDefinition(name, this._file);
	
	var result = next(name, callback);
	
	this._finalizeLastProxy();
	this._config.debugStack.popNamespace();
	
	return result;
};


/**
 * @param {string|function} file
 */
Manager.prototype.parse = function (file)
{
	this._file = this._config.rootNamespace.getFile(file);
	
	this._config.pushStack(
		file, 
		{
			thisProxy:			this._thisProxy,
			rootProxy:			this._rootProxy,
			definitionCallback: this._onDefine.bind(this)
		});
	
	try
	{
		if (typeof file === 'string')
			require(this._file.fullPath());
		else
			file.call(null, this._rootProxy);
		
		this._finalizeLastProxy();
	}
	catch (e)
	{
		this._config.popStack();
		throw e;
	}
};

/**
 * @returns {DefinitionConfig|*}
 */
Manager.prototype.config = function ()
{
	return this._config;
};

/**
 * @returns {RootProxy}
 */
Manager.prototype.root = function ()
{
	return this._rootProxy;
};


module.exports = Manager;