const NamespaceException = require('./NamespaceException');


/**
 * @param {DebugStack} stack
 * @param {string} fullName
 * @constructor
 */
function MemberNotDefinedException(stack, fullName)
{
	var message = 'The member [' + fullName + '] was not found';
	
	NamespaceException.call(this, message);
	
	this.stack = '\n> Error: ' + this.message + '\n' +
		'> Namespace stack: \n' + 
		stack.toString() + 
		'\n> Original: ' + this.stack;
}


MemberNotDefinedException.prototype = Object.create(NamespaceException.prototype);
MemberNotDefinedException.prototype.constructor = MemberNotDefinedException;


module.exports = MemberNotDefinedException;