const NamespaceException = require('./NamespaceException');


/**
 * @param {string} path
 * @constructor
 */
function InvalidPathException(path)
{
	var message = 'The path [' + path + 
		'] does not match any file or folder, and is not a part of a registered namespace';
	
	NamespaceException.call(this, message);
	
	this.stack = (new Error()).stack;
	this.namespace = path;
}


InvalidPathException.prototype = Object.create(NamespaceException.prototype);
InvalidPathException.prototype.constructor = InvalidPathException;


module.exports = InvalidPathException;