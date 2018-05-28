const RecursiveDependencyException = require('../Exceptions/RecursiveDependencyException');


function DebugStack()
{
	this._lastObject	= null;
	this._stack			= [];
}


DebugStack.prototype._createObject = function ()
{
	this._lastObject = {
		file: null,
		namespace: null,
		target: null
	};
};

DebugStack.prototype._getLastObject = function ()
{
	if (this._lastObject === null)
	{
		this._createObject();
		this._stack.push(this._lastObject);
	}
	
	return this._lastObject;
};


DebugStack.prototype.setFile = function (file)
{
	for (var i = 0; i < this._stack.length - 1; i++)
	{
		if (this._stack[i].file === file)
			throw new RecursiveDependencyException(this, file);
	}
	
	this._getLastObject().file = file;
};

DebugStack.prototype.setNamespace = function (namespace)
{
	this._getLastObject().namespace = namespace;
};

DebugStack.prototype.setTarget = function (target)
{
	this._getLastObject().target = target;
};

DebugStack.prototype.foreach = function (callback)
{
	for (var i = 0; i < this._stack.length; i++)
	{
		callback(this._stack[i]);
	}
};

DebugStack.prototype.push = function ()
{
	this._stack.push(this._lastObject);
	this._createObject();
};

DebugStack.prototype.pop = function ()
{
	this._stack.pop();
	this._lastObject = (this._stack.length > 0 ? this._stack[this._stack.length - 1] : null);
};


module.exports = DebugStack;