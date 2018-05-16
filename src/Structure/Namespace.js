/**
 * @param {string} fullName
 * @param {string} name
 * @param {Namespace=null} parent
 * @constructor
 */
function Namespace(fullName, name, parent)
{
	this._parent	= parent || null;
	this._fullName	= fullName || '';
	this._name		= name || '';
	this._members	= [];
}


Namespace.prototype.isRoot = function ()
{
	return this._parent === null;
};

Namespace.prototype.parent = function ()
{
	return this._parent;
};

Namespace.prototype.fullName = function ()
{
	return this._fullName;
};

Namespace.prototype.getFullMemberName = function (memberName)
{
	if (this._fullName)
		return this._fullName + '.' + memberName;
	else
		return memberName;
};


Namespace.prototype.name = function ()
{
	return this._name;
};

Namespace.prototype.members = function ()
{
	return this._members.concat();
};

/**
 * @param {NamespaceMember} member
 */
Namespace.prototype.addMember = function (member)
{
	this._members.push(member);
};

/**
 * @param {NamespaceMember[]} members
 */
Namespace.prototype.addMembers = function (members)
{
	this._members = this._members.concat(members);
}; 


module.exports = Namespace;