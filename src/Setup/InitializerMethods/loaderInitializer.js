'use strict';



const Root			= require('../Root');
const loadConfig	= require('../../Configuration/loader');
const Loader		= require('../../DynamicLoading/Loader');
const configParser	= require('../../DynamicLoading/configParser');

const GetFromLoader	= require('../../NamespaceProxy/GetSetHandlers/GetFromLoader');


/**
 * @param {GetSetChain} chain
 * @param {boolean} isVirtual
 */
function loaderInitializer(chain, isVirtual)
{
	var config	= loadConfig(Root.path(), isVirtual);
	var map		= config.map || {};
	var loader	= Loader.instance();
	
	loader.add(configParser(map));
	
	chain.add(new GetFromLoader(loader));
}


module.exports = loaderInitializer;