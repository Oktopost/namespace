function NamespaceException(message)
{
	Error.call(this);
	
	this.stack = (new Error()).stack;
	this.message = message;
}


NamespaceException.prototype = Object.create(Error.prototype);
NamespaceException.prototype.constructor = NamespaceException;


module.exports = NamespaceException;