'use strict';


const Namespace		= require('../Namespace');
const Cursor		= require('../NamespaceProxy/Cursor');
const GetSetChain	= require('../NamespaceProxy/GetSetChain');
const ProxyHandler	= require('../NamespaceProxy/ProxyHandler');


/**
 * @return Namespace
 */
function buildDynamic()
{
	var namespace;
	var functions	= Array.prototype.slice.call(arguments);
	var chain		= new GetSetChain();
	var cursor		= Cursor.createRoot();
	
	var proxyHandler = new ProxyHandler(
		cursor,
		chain.setterCallback(),
		chain.getterCallback());
	
	namespace = new Namespace(proxyHandler.proxy());
	
	for (var i = 0; i < functions.length; i++)
	{
		var res = functions[i](chain);
			
		if (res instanceof Function) 
		{
			res();
		}
	}
	
	global.namespace = namespace.getCreator();
	return namespace;
}


module.exports = buildDynamic;