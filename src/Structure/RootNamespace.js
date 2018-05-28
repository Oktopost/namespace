const File					= require('./File');
const Namespace				= require('./Namespace');
const NamespaceMember		= require('./NamespaceMember');
const NamespaceDefinition	= require('./NamespaceDefinition');

const MemberAlreadyDefinedException	= require('../Exceptions/MemberAlreadyDefinedException');


/**
 * @constructor
 */
function RootNamespace()
{
	this._rootNamespace = new Namespace('', '');
	
	this._members		= {};
	this._namespaces	= {};
	this._files			= {};
}


/**
 * @param {string} fullName
 * @return {string}
 * @private
 */
RootNamespace.prototype._getName = function (fullName)
{
	if (fullName.length === 0)
		return '';
	else if (fullName.lastIndexOf('.') > 0)
		return fullName.substr(fullName.lastIndexOf('.') + 1);
	else
		return fullName;
};

/**
 * @param {string} fullName
 * @return {Namespace|null}
 * @private
 */
RootNamespace.prototype._getParent = function (fullName)
{
	if (fullName.length === 0)
		return null;
	else if (fullName.lastIndexOf('.') === -1)
		return this._rootNamespace;
	else
		return this.getOrCreateNamespace(fullName.substr(0, fullName.lastIndexOf('.')));
};


/**
 * @param {string} filePath
 * @return {File}
 */
RootNamespace.prototype.getFile = function (filePath)
{
	if (typeof this._files[filePath] === 'undefined')
	{
		this._files[filePath] = new File(filePath);
	}
	
	return this._files[filePath];
};

/**
 * @param {string} fullName
 * @return {Namespace}
 */
RootNamespace.prototype.getOrCreateNamespace = function (fullName)
{
	if (typeof this._namespaces[fullName] === 'undefined')
	{
		var name = this._getName(fullName);
		var parent = this._getParent(fullName);
		
		this._namespaces[fullName] = new Namespace(fullName, name, parent);
	}
	
	return this._namespaces[fullName];
};

/**
 * @param {string} fullName
 * @return {Namespace|null}
 */
RootNamespace.prototype.getNamespace = function (fullName)
{
	return this._namespaces[fullName] || null;
};

/**
 * @param {string} fullName
 * @return {boolean}
 */
RootNamespace.prototype.hasNamespace = function (fullName)
{
	return typeof this._namespaces[fullName] !== 'undefined';
};

/**
 * @param {string} namespaceName
 * @param {File|string=null} file File object or full file path
 * @return {NamespaceDefinition}
 */
RootNamespace.prototype.createDefinition = function (namespaceName, file)
{
	if (typeof file === 'string')
		file = this._getFile(file);
	
	var namespace = this.getOrCreateNamespace(namespaceName);
	var definition = new NamespaceDefinition(this, namespace);
	
	if (file)
		definition.setFile(file);
	
	return definition;
};

/**
 * @param {NamespaceDefinition} source
 * @param {string} name
 * @param {*} value
 * @return {NamespaceMember}
 */
RootNamespace.prototype.createMember = function (source, name, value)
{
	var fullName = source.namespace().getFullMemberName(name);
	
	if (typeof this._members[fullName] !== 'undefined')
		throw new MemberAlreadyDefinedException(this._members[fullName]);
	
	var member = new NamespaceMember(source, name, value);
	
	this._members[fullName] = member;
	source.namespace().addMember(member);
	
	return member;
};

/**
 * @param {string} fullName
 * @return {NamespaceMember|null}
 */
RootNamespace.prototype.getMember = function (fullName)
{
	return this._members[fullName] || null;
};

/**
 * @param {string} fullName
 * @return {*|undefined}
 */
RootNamespace.prototype.getValue = function (fullName)
{
	return this.hasMember(fullName) ? this.getMember(fullName).value() : undefined;
};

/**
 * @param {string} fullName
 * @return {boolean}
 */
RootNamespace.prototype.hasMember = function (fullName)
{
	return (typeof this._members[fullName] !== 'undefined');
};


module.exports = RootNamespace;