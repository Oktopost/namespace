'use strict';


const Namespace		= require('../Namespace');
const Cursor		= require('../NamespaceProxy/Cursor');
const GetSetChain	= require('../NamespaceProxy/GetSetChain');
const ProxyHandler	= require('../NamespaceProxy/ProxyHandler');


/**
 * @return {Promise}
 */
function buildDynamic()
{
	var namespace;
	var functions	= Array.prototype.slice.call(arguments);
	var chain		= new GetSetChain();
	var cursor		= Cursor.createRoot();
	var promise		= Promise.resolve();
	
	var proxyHandler = new ProxyHandler(
		cursor,
		chain.setterCallback(),
		chain.getterCallback());
	
	namespace = new Namespace({}, proxyHandler.proxy());
	
	for (var i = 0; i < functions.length; i++)
	{
		promise = promise.then(
			((index) =>
			{
				var res = functions[index](chain);
				
				if (res instanceof Promise)
				{
					return res.then(() => {});
				}
				else if (res instanceof Function) 
				{
					return Promise.resolve().then(() => { return res(); })
				}
			}).bind(null, i));
	}
	
	return promise.then(
		() => 
		{
			global.namespace = namespace.getCreator();
			return namespace; 
		}); 
}


module.exports = buildDynamic;