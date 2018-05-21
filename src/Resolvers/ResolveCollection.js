const AbstractResolver = require('./AbstractResolver');


function ResolveCollection()
{
	AbstractResolver.call(this);
	
	this._resolvers = [];
}


ResolveCollection.prototype = Object.create(AbstractResolver.prototype);
ResolveCollection.prototype.constructor = ResolveCollection;


ResolveCollection.prototype._foreachResolver = function (callback)
{
	for (var i = 0; i < this._resolvers; i++)
	{
		if (callback.call(this, this._resolvers[i]) === false)
			break;
	}
};


ResolveCollection.prototype.isValidFile = function (fullName)
{
	var isValid = false;
	
	this._foreachResolver(function (resolver)
	{
		if (resolver.isValidFile(fullName))
		{
			isValid = true;
			return false;
		}
	});
	
	return isValid;
};

ResolveCollection.prototype.isValidPath = function (fullName)
{
	var isValid = false;
	
	this._foreachResolver(function (resolver)
	{
		if (resolver.isValidPath(fullName))
		{
			isValid = true;
			return false;
		}
	});
	
	return isValid;
};

ResolveCollection.prototype.getFilePath = function (fullName)
{
	var file = false;
	
	this._foreachResolver(function (resolver)
	{
		if (resolver.isValidFile(fullName))
		{
			file = resolver.getFilePath(fullName);
			return false;
		}
	});
	
	return file;
};


module.exports = ResolveCollection;