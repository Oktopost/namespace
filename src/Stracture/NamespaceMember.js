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
}


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
	var path = this._definition.namespace().fullName();
	return (path ? path + '.' + this._name : this._name);
};


module.exports = NamespaceMember;