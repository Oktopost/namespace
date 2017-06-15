'use strict';


/**
 * @param {string} fullPath
 * @param {string} name
 * @param {{}} root
 * @param {{}} head
 * @constructor
 */
function Cursor(fullPath, name, root, head)
{
	this.fullName	= fullPath;
	this.name		= name;
	this.root		= root;
	this.head		= head;
}


/**
 * @param {string} name
 * @return {string}
 */
Cursor.prototype.getFullName = function (name)
{
	return (this.fullName.length > 0 ?
		this.fullName + '.' + name : 
		name
	);
};

/**
 * @param name
 * @return {Cursor}
 */
Cursor.prototype.createChild = function (name)
{
	var fullName = this.getFullName(name);
	return new Cursor(fullName, name, this.root, {});
};

/**
 * @return {Cursor}
 */
Cursor.createRoot = function ()
{
	var root = {};
	return new Cursor('', '', root, root);
};


module.exports = Cursor;