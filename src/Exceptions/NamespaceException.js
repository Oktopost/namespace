function NamespaceException(message)
{
	this.message = message;
	this.stack = (new Error()).stack;
}


NamespaceException.prototype = new Error;


module.exports = NamespaceException;