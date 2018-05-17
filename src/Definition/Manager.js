const RootProxy			= require('./../Proxy/RootProxy');
const DefinitionProxy	= require('./../Proxy/DefinitionProxy');


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
	
	this._currDefinition	= null;
	this._defProxy			= new DefinitionProxy(this._onDefine.bind(this));
	this._scopeProxy		= new RootProxy(scopeProxyCallbacks);
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
		// TODO: Throw exception, object was not defined inside the file
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
	var member = this._currDefinition.createMember(name, value);
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
		// TODO: Exception
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
	
	this._currDefinition.addDependency(member);
	proxy.setValue(member.value());
	
};


/**
 * @param {string} file
 */
Manager.prototype.parse = function (file)
{
	
};


module.exports = Manager;