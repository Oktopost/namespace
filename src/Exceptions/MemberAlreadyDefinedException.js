const NamespaceException = require('./NamespaceException');


/**
 * @param {NamespaceMember} member
 * @param {string=null} message
 * @constructor
 */
function MemberAlreadyDefinedException(member, message)
{
	message = message || 
		'The element "' + 
			member.name() + 
			'" is already defined inside ' + 
			"[Namespace " + member.definition().namespace().fullName() + "]:" + 
			"[File " + member.definition().file().fullPath() + "]";
	
	NamespaceException.call(this, message);
	
	this.stack = (new Error()).stack;
	this.member = member;
}


MemberAlreadyDefinedException.prototype = Object.create(NamespaceException.prototype);
MemberAlreadyDefinedException.prototype.constructor = MemberAlreadyDefinedException;


module.exports = MemberAlreadyDefinedException;