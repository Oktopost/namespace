const RootProxy					= require('./../Proxy/RootProxy');
const DefinitionProxy			= require('./../Proxy/DefinitionProxy');
const InvalidPathException		= require('./../Exceptions/InvalidPathException');
const MemberNotDefinedException = require('./../Exceptions/MemberNotDefinedException');


/**
 * @param {DefinitionConfig} config
 * 
 * @property {NamespaceDefinition} _currDefinition
 * 
 * @constructor
 */
function Manager(config)
{
	var scopeProxyCallbacks = {
		onGet: this._onGetPath.bind(this),
		onReference: this._onGetElement.bind(this)
	};
	
	this._config = config;
	
	this._file          = null;
	this._currDefObject = null;
	this._defProxy      = new DefinitionProxy(this._onDefine.bind(this));
	this._scopeProxy    = new RootProxy(scopeProxyCallbacks);
}


/**
 * @param {string} fullName
 * @return {NamespaceMember}
 * @private
 */
Manager.prototype._findMember = function (fullName)
{
	var member;
	
	var file	= this._config.fileResolver.getFilePath(fullName);
	var manager	= new Manager(this._config);
	
	manager.parse(file);
	member = this._config.rootNamespace.getMember(fullName);
	
	if (member === null)
	{
		throw new MemberNotDefinedException(file, fullName);
	}
	
	return member.value();
};


/**
 * @param {string} name
 * @param {*} value
 * @return {*}
 * @private
 */
Manager.prototype._onDefine = function (name, value)
{
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
		return this._findMember(data.fullName);
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
	var fullName	= proxy.getFullName();
	var member		= this._config.rootNamespace.getMember(fullName);
	
	if (member === null)
	{
		member = this._findMember(fullName);
	}
	
	this._currDefObject.addDependency(member);
	proxy.setValue(member.value());
};

Manager.prototype._createDefinition = function (name)
{
	this._config.debugStack.pushNamespace(name);
	this._currDefObject = this._config.rootNamespace.createDefinition(name, this._file);
};


/**
 * @param {string} file
 */
Manager.prototype.parse = function (file)
{
	this._file = this._config.rootNamespace.getFile(file);
	
	this._config.pushStack(
		file, 
		{
			thisProxy:			this._defProxy,
			rootProxy:			this._scopeProxy,
			definitionCallback: this._onDefine.bind(this)
		});
	
	try
	{
		require(this._file.fullPath());
	}
	catch (e)
	{
		this._config.popStack();
		throw e;
	}
};


module.exports = Manager;