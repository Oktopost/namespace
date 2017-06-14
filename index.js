'use strict';


const Namespace = require('./src/Namespace');

const Root			= require('./src/Setup/Root');
const buildDynamic	= require('./src/Setup/buildDynamic');
const Initializers	= require('./src/Setup/Initializers');

const DependencyLogger	= require('./src/NamespaceProxy/GetSetHandlers/DependencyLogger');
const Dependencies		= require('./src/Build/Dependencies');


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
	
	return namespace.root();
}


const INDEX = {

	/**
	 * @param {string} dir
	 * @return {{in: INDEX.in, dynamic: INDEX.dynamic, static: INDEX.static, getDependencies: INDEX.getDependencies, setupDynamic: INDEX.setupDynamic}}
	 */
	in: function (dir)
	{
		Root.set(dir);
		return INDEX; 
	},
	
	dynamic: function (callback)
	{
		var namespace = buildDynamic(Initializers.defaultDynamicSetup);
		return invokeCallback(namespace, callback);
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
		
		return namespace.root();
	},
	
	setupDynamic: function (setup, callback)
	{
		var namespace = buildDynamic(
			Initializers.defaultDynamicSetup,
			setup
		);
		
		return invokeCallback(namespace, callback);
	}
};

module.exports = INDEX;