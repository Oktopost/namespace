'use strict';


const loaderInitializer = require('./InitializerMethods/loaderInitializer');

const ProxyCreator = require('../NamespaceProxy/GetSetHandlers/ProxyCreator');


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
	 * @return {Promise}
	 */
	loader: (chain) => 
	{
		return loaderInitializer(chain);
	},
	
	/**
	 * @param {GetSetChain} chain
	 */
	defaultDynamicSetup: (chain) => 
	{
		Initializers.loader(chain);
		Initializers.proxyHandler(chain);
	}
};


module.exports = Initializers;