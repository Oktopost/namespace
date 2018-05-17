const RootNamespace = require('./../Structure/RootNamespace');
const CallbackStuck = require('./../NamespaceCallback/CallbackStuck');


/**
 * @property {RootNamespace}	rootNamespace
 * @property {CallbackStuck}	callbackStuck
 * @property {AbstractResolver} fileResolver
 * @constructor
 */
function DefinitionConfig()
{
	this.rootNamespace	= new RootNamespace();
	this.callbackStuck	= new CallbackStuck();
	this.fileResolver 	= null;
}


module.exports = DefinitionConfig;