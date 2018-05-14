const DefinitionsCollection = require('./Runtime/DefinitionsCollection');


function RuntimeDefinition()
{
	this._isInitialized = false;
	this._lastNamespace = null;
	
	this._currentDefinition = null;
	this._currentCreator	= null;
	this._currentRoot		= null;
	
	this._definitions		= [];
	this._namespaceCreators	= [];
	this._rootElements		= [];
}


RuntimeDefinition.prototype._getNamespaceFunction = function ()
{
	var self = this;
	
	return function (name, definition)
	{
		if (!definition)
			throw new Error('Namespace definition callback was not passed!');
		
		var def = self._currentDefinition.add(name);
		
		
		def.setReturnValue(definition.call(def.getThisObject(), self._currentRoot));
		
		
		return self._currentCreator(def);
	};
};


RuntimeDefinition.prototype.initialize = function ()
{
	if (this._isInitialized)
		throw new Error('RuntimeDefinition already initialized');
	
	this._isInitialized = true;
	
	if (global.namespace)
		this._lastNamespace = global.namespace;
	
	global.namespace = this._getNamespaceFunction();
};

RuntimeDefinition.prototype.destroy = function ()
{
	if (!this._isInitialized)
		throw new Error('RuntimeDefinition was not initialized');
	
	this._isInitialized = false;
	
	if (this._lastNamespace)
		global.namespace = this._lastNamespace;
	
	this._lastNamespace = null;
};

RuntimeDefinition.prototype.pushStack = function (rootElement, creator)
{
	var def = new DefinitionsCollection();
	
	this._rootElements.push(rootElement);
	this._namespaceCreators.push(creator);
	this._definitions.push(def);
	
	this._currentDefinition = def;
	this._currentCreator = creator;
	this._currentRoot = rootElement;
};

/**
 * @return {DefinitionsCollection}
 */
RuntimeDefinition.prototype.popStack = function ()
{
	var result;
	
	if (this._stackIndex)
		throw new Error('The stack is empty');
	
	this._rootElements.pop();
	this._namespaceCreators.pop();
	result = this._definitions.pop();
	
	if (this._definitions.length)
	{
		this._currentDefinition	= this._definitions[this._definitions.length - 1];
		this._currentCreator	= this._namespaceCreators[this._namespaceCreators.length - 1];
		this._currentRoot		= this._rootElements[this._rootElements.length - 1];
	}
	else
	{
		this._currentDefinition	= null;
		this._currentCreator	= null;
		this._currentRoot		= null;
	}
	
	return result;
};


module.exports = RuntimeDefinition;