const NamespaceException = require('./NamespaceException');


/**
 * @param {string} file
 * @param {string} fullName
 * @constructor
 */
function MemberNotDefinedException(file, fullName)
{
	var message = 'The member [' + fullName + '] was not found after requiring the file [' + file + ']';
	
	NamespaceException.call(this, message);
	
	this.stack = (new Error()).stack;
	this.file = file;
	this.namespace = file;
}


MemberNotDefinedException.prototype = Object.create(NamespaceException.prototype);
MemberNotDefinedException.prototype.constructor = MemberNotDefinedException;


module.exports = MemberNotDefinedException;