/**
 * @param {NamespaceDefinition} def
 * @param {string} name
 * @param {*} value
 * @constructor
 */
function NamespaceMember(def, name, value)
{
	this._definition	= def;
	this._name			= name;
	this._value			= value;
	this._fullName		= null;
}


/**
 * @return {NamespaceDefinition}
 */
NamespaceMember.prototype.definition = function ()
{
	return this._definition;
};

NamespaceMember.prototype.name = function ()
{
	return this._name;
};

NamespaceMember.prototype.value = function ()
{
	return this._value;
};

NamespaceMember.prototype.fullName = function ()
{
	if (this._fullName === null)
	{
		var path = this._definition.namespace().fullName();
		this._fullName = (path ? path + '.' + this._name : this._name);
	}
	
	return this._fullName;
};


module.exports = NamespaceMember;