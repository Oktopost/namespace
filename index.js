'use strict';


const Namespace = require('./src/Namespace');

const buildDynamic = require('./src/Setup/buildDynamic');
const Initializers = require('./src/Setup/Initializers');

const DependencyLogger = require('./src/NamespaceProxy/GetSetHandlers/DependencyLogger');
const Dependencies = require('./src/Build/Dependencies');


/**
 * @param {Namespace} namespace
 * @param callback
 * @return {Promise.<Namespace>}
 */
function invokeCallback(namespace, callback)
{
	if (typeof callback === 'function')
	{
		callback(namespace);
	}
	else if (typeof callback === 'string')
	{
		require(callback);
	}
	
	return Promise.resolve(namespace);
}


module.exports = {
	
	dynamic: function (callback)
	{
		return buildDynamic(Initializers.defaultDynamicSetup)
			.then((namespace) => invokeCallback(namespace, callback));
	},
	
	static: function (callback)
	{
		var namespace = new Namespace();
		global.namespace = namespace.getCreator();
		return invokeCallback(namespace, callback)
	},
	
	getDependencies: function (setup, callback)
	{
		var dep = new DependencyLogger(); 
		var object = new Dependencies(dep);
		
		return buildDynamic(
				Initializers.defaultDynamicSetup,
				(chain) => { chain.add(dep) },
				setup
			)
			.then((namespace) => 
			{
				callback(object, namespace);
			});
	},
	
	setupDynamic: function (setup, callback)
	{
		return buildDynamic(
				Initializers.defaultDynamicSetup,
				setup
			)
			.then((namespace) => invokeCallback(namespace, callback));
	}
};