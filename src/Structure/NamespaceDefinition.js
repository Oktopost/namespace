/**
 * @param {RootNamespace} root
 * @param {Namespace} namespace
 * @constructor
 */
function NamespaceDefinition(root, namespace)
{
	this._root			= root;
	this._namespace 	= namespace;
	this._file			= null;
	this._members		= [];
	
	this._dependencyNames	= {};
	this._dependencies		= [];
}


/**
 * @param {File} file
 */
NamespaceDefinition.prototype.setFile = function (file)
{
	if (this._file)
		throw new Error('File already defined for this object');
		
	this._file = file;
};

/**
 * @return {File}
 */
NamespaceDefinition.prototype.file = function ()
{
	return this._file;
};

/**
 * @return {Namespace}
 */
NamespaceDefinition.prototype.namespace = function ()
{
	return this._namespace;
};

/**
 * @return {RootNamespace}
 */
NamespaceDefinition.prototype.root = function ()
{
	return this._root;
};

/**
 * @return {NamespaceMember[]}
 */
NamespaceDefinition.prototype.members = function ()
{
	return this._members.concat();
};

/**
 * @return {NamespaceMember}
 */
NamespaceDefinition.prototype.createMember = function (name, value)
{
	var member = this._root.createMember(this, name, value);
	
	this._members.push(member);
	
	return member;
};

/**
 * @param {NamespaceMember} dep
 */
NamespaceDefinition.prototype.addDependency = function (dep)
{
	if (typeof this._dependencyNames[dep.fullName()] === 'undefined')
	{
		this._dependencyNames[dep.fullName()] = true;
		this._dependencies.push(dep);
	}
};

/**
 * @return {NamespaceMember[]}
 */
NamespaceDefinition.prototype.getDependencies = function ()
{
	return this._dependencies.concat();
};


module.exports = NamespaceDefinition;