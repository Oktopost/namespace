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


module.exports = DefinitionConfig;