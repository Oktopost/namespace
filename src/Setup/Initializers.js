'use strict';


const loaderInitializer = require('./InitializerMethods/loaderInitializer');

const ProxyCreator = require('../NamespaceProxy/GetSetHandlers/ProxyCreator');
const GetFromLoader = require('../NamespaceProxy/GetSetHandlers/GetFromLoader');


const Initializers = {
	
	/**
	 * @param {GetSetChain} chain
	 * @return {Promise}
	 */
	proxyHandler: (chain) => 
	{
		return Promise.resolve().
			then(() => { chain.add(new ProxyCreator(chain)) });
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
	 * @return {Promise}
	 */
	defaultDynamicSetup: (chain) => 
	{
		return Initializers.loader(chain)
			.then(() => {
				return Initializers.proxyHandler(chain);
			});
	}
};


module.exports = Initializers;