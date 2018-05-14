function DefinitionResult(name)
{
	this._fullName		= name || null;
	this._returnValue	= undefined;
	this._thisObject	= {};
}


DefinitionResult.prototype.getReturnValue = function()
{
	return this._returnValue;
};

DefinitionResult.prototype.getFullName = function()
{
	return this._fullName;
};

DefinitionResult.prototype.setFullName = function(fullName)
{
	this._fullName = fullName;
};

DefinitionResult.prototype.setReturnValue = function()
{
	return this._returnValue;
};

DefinitionResult.prototype.getThisObject = function()
{
	return this._thisObject;
};

DefinitionResult.prototype.hasReturnValue = function()
{
	return typeof this._returnValue !== 'undefined';
};


module.exports = DefinitionResult;