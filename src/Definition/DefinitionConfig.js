const RootNamespace 	= require('./../Structure/RootNamespace');
const DebugStack		= require('./../Definition/DebugStack');
const CallbackStack		= require('./../Definition/CallbackStack');


/**
 * @property {DebugStack}		debugStack
 * @property {RootNamespace}	rootNamespace
 * @property {CallbackStack}	callbackStack
 * @property {AbstractResolver} fileResolver
 * @constructor
 */
function DefinitionConfig()
{
	this.debugStack		= new DebugStack();
	this.rootNamespace	= new RootNamespace();
	this.callbackStack	= new CallbackStack();
	this.fileResolver	= null;
}


DefinitionConfig.prototype.popStack = function ()
{
	this.debugStack.popFile();
	this.callbackStack.popStack();
};

/**
 * @param {string} file
 * @param {{thisProxy, rootProxy, definitionCallback}} obj
 */
DefinitionConfig.prototype.pushStack = function (file, obj)
{
	this.callbackStack.pushStack(obj);
	this.debugStack.pushFile(file);
};


module.exports = DefinitionConfig;