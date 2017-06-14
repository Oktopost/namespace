'use strict';


const loadConfig	= require('../../Configuration/loader');
const Loader		= require('../../DynamicLoading/Loader');
const configParser	= require('../../DynamicLoading/configParser');

const GetFromLoader	= require('../../NamespaceProxy/GetSetHandlers/GetFromLoader');


/**
 * @param {GetSetChain} chain
 * @return {Promise}
 */
function loaderInitializer(chain)
{
	var config	= loadConfig();
	var map		= config.map || {};
	var loader	= new Loader();
	
	loader.add(configParser(map));
	
	chain.add(new GetFromLoader(loader));
}


module.exports = loaderInitializer;