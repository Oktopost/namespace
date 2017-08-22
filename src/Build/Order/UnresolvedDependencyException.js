function UnresolvedDependencyException(dependencies)
{
	this.name = 'UnresolvedDependencyException';
	this.message = 'Could not resolve dependecies ' + dependencies;
}

UnresolvedDependencyException.prototype = Object.create(Error.prototype);
UnresolvedDependencyException.prototype.constructor = UnresolvedDependencyException;


module.exports = UnresolvedDependencyException;