function NamespaceCouldNotBeLoadedException(name)
{
	this.name = 'NamespaceCouldNotBeLoadedException';
	this.message = 'Could not load namespace ' + name;
}

NamespaceCouldNotBeLoadedException.prototype = Object.create(Error.prototype);
NamespaceCouldNotBeLoadedException.prototype.constructor = NamespaceCouldNotBeLoadedException;


module.exports = NamespaceCouldNotBeLoadedException;