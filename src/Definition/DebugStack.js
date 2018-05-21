function DebugStack()
{
	this._files			= [];
	this._namespaces	= [];
	this._currNamespace = null;
}


DebugStack.prototype.pushFile = function (path)
{
	this._files.push(path);
	this._namespaces.push(this._currNamespace);
	this._currNamespace = null;
};

DebugStack.prototype.pushNamespace = function (name)
{
	this._currNamespace = name;
};

DebugStack.prototype.popFile = function ()
{
	this._currNamespace = this._namespaces.pop() || null;
	this._file = this._files.pop() || null;
};


module.exports = DebugStack;