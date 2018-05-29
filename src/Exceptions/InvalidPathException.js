const NamespaceException = require('./NamespaceException');


/**
 * @param {DebugStack} stack
 * @param {string} path
 * @constructor
 */
function InvalidPathException(stack, path)
{
	var message = 'The path [' + path + 
		'] does not match any file or folder, and is not a part of a registered namespace';
	
	NamespaceException.call(this, message);
	
	this.stack = '\n> Error: ' + this.message + '\n' +
		'> Namespace stack: \n' + 
		stack.toString() + 
		'\n> Original: ' + this.stack;
}


InvalidPathException.prototype = Object.create(NamespaceException.prototype);
InvalidPathException.prototype.constructor = InvalidPathException;


module.exports = InvalidPathException;