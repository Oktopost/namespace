'use strict';


const loaderInitializer = require('./InitializerMethods/loaderInitializer');

const ProxyCreator = require('../NamespaceProxy/GetSetHandlers/ProxyCreator');

const DependencyLogger	= require('../NamespaceProxy/GetSetHandlers/DependencyLogger');
const Dependencies		= require('../Build/Dependencies');


const Initializers = {
	
	/**
	 * @param {GetSetChain} chain
	 * @return {Promise}
	 */
	proxyHandler: (chain) => 
	{
		chain.add(new ProxyCreator(chain));
	},
	
	/**
	 * @param {GetSetChain} chain
	 * @param {boolean=false} isVirtual
	 * @return {Promise}
	 */
	loader: (chain, isVirtual) => 
	{
		return loaderInitializer(chain, isVirtual || false);
	},
	
	/**
	 * @param {GetSetChain} chain
	 */
	defaultDynamicSetup: (chain) => 
	{
		Initializers.loader(chain, false);
		Initializers.proxyHandler(chain);
	},
	
	/**
	 * @param {GetSetChain} chain
	 */
	defaultVirtualSetup: (chain) => 
	{
		Initializers.loader(chain, true);
		Initializers.proxyHandler(chain);
	},

	/**
	 * @return {callback}
	 */
	createDependencyLoggerSetup: () => 
	{
		var dep = new DependencyLogger(); 
		var object = new Dependencies(dep);
		
		function callback (chain) 
		{
			Initializers.defaultVirtualSetup(chain);
			chain.add(dep);
		}
		
		callback.dependenciesLogger = dep;
		
		return callback;
	},
};


module.exports = Initializers;