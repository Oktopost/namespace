const NamespaceException = require('./../Exceptions/NamespaceException');


function AbstractResolver()
{
	
}


AbstractResolver.prototype.isValidPath = function (fullName)
{
	throw new NamespaceException('Method not implemented');
};

AbstractResolver.prototype.isValidFile = function (fullName)
{
	throw new NamespaceException('Method not implemented');
};

AbstractResolver.prototype.getFilePath = function (fullName)
{
	throw new NamespaceException('Method not implemented');
};


module.exports = AbstractResolver;