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
	this._getLastObject().file = file;
	
	for (var i = 0; i < this._stack.length - 2; i++)
	{
		if (this._stack[i].file === file)
			throw new RecursiveDependencyException(this, file);
	}
};

DebugStack.prototype.setNamespace = function (namespace)
{
	this._getLastObject().namespace = namespace;
};

DebugStack.prototype.setTarget = function (target)
{
	this._getLastObject().target = target;
};

DebugStack.prototype.foreach = function (callback, isReversed)
{
	var index;
	var from = (isReversed ? this._stack.length - 1: 0);
	var step = (isReversed ? -1 : +1);
	var cond = (isReversed ? () => { return index >= 0; } : () => { return index < this._stack.length; });
	
	for (index = from; cond(); index += step)
	{
		callback(this._stack[index]);
	}
};

DebugStack.prototype.push = function ()
{
	this._createObject();
	this._stack.push(this._lastObject);
};

DebugStack.prototype.pop = function ()
{
	this._stack.pop();
	this._lastObject = (this._stack.length > 0 ? this._stack[this._stack.length - 1] : null);
};

DebugStack.prototype.toString = function ()
{
	var str = '';
	var parts;
	var index = this._stack.length;
	
	this.foreach(function (d)
		{
			parts = [];
			
			if (str.length > 0)
				str += '\n';
			
			str += `    ${index--}) `;
			
			if (d.file)
				parts.push('Source        : ' + d.file);
			
			if (d.namespace)
				parts.push('Namespace     : ' + d.namespace);
			
			if (d.target)
				parts.push('Searching for : ' + d.target);
			
			if (!parts.length === 0)
				str += '< unknown >';
			else
				str += parts.join('\n       ');
		},
		true);
	
	return str;
};


module.exports = DebugStack;