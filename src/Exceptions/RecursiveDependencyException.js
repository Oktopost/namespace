const NamespaceException = require('./NamespaceException');


/**
 * @param {DebugStack} stack
 * @param {string} name
 * @constructor
 */
function RecursiveDependencyException(stack, name)
{
	NamespaceException.call(this, `Recursive dependency detected in file ${name}`);
	
	this.stack = '\n> Error: ' + this.message + '\n' +
		'> Namespace stack: \n' + 
		stack.toString() + 
		'\n> Original: ' + this.stack;
}


RecursiveDependencyException.prototype = Object.create(NamespaceException.prototype);
RecursiveDependencyException.prototype.constructor = RecursiveDependencyException;


module.exports = RecursiveDependencyException;