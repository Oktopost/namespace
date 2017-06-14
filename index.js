'use strict';


const Namespace = require('./src/Namespace');

const buildDynamic = require('./src/Setup/buildDynamic');
const Initializers = require('./src/Setup/Initializers');

const DependencyLogger = require('./src/NamespaceProxy/GetSetHandlers/DependencyLogger');
const Dependencies = require('./src/Build/Dependencies');


/**
 * @param {Namespace} namespace
 * @param callback
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
	
	return namespace;
}


module.exports = {
	
	dynamic: function (callback)
	{
		var namespace = buildDynamic(Initializers.defaultDynamicSetup);
		invokeCallback(namespace, callback);
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
		
		var namespace = buildDynamic(
			Initializers.defaultDynamicSetup,
			(chain) => { chain.add(dep) },
			setup
		);
			
		callback(object, namespace);
	},
	
	setupDynamic: function (setup, callback)
	{
		var namespace = buildDynamic(
			Initializers.defaultDynamicSetup,
			setup
		);
		
		invokeCallback(namespace, callback);
	}
};