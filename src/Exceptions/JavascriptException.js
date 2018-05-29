const NamespaceException = require('./NamespaceException');


/**
 * @param {DebugStack} stack
 * @param {Error} e
 * @constructor
 */
function JavascriptException(stack, e)
{
	NamespaceException.call(this, e.message);
	
	this.stack = '\n> Error: ' + e.message + '\n' +
		'> Namespace stack: \n' + 
		stack.toString() + '\n' +   
		'> Original: ' + e.stack;
}


JavascriptException.prototype = Object.create(NamespaceException.prototype);
JavascriptException.prototype.constructor = JavascriptException;


module.exports = JavascriptException;

