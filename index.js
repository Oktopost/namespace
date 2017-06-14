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


/**
 * @param {string|function=} a
 * @param {function=} b
 */
function resolveParameters(a, b)
{
	if (typeof a === 'string')
	{
		Root.set(a);
		return (typeof b === 'function' ? b : undefined);
	}
	else if (typeof a === 'function')
	{
		return a;
	}
}


const INDEX = {

	/**
	 * @param {string} dir
	 * @return {self}
	 */
	in: function (dir)
	{
		Root.set(dir);
		return this; 
	},

	/**
	 * @param {string|function=} a
	 * @param {function=} b
	 * @return {*}
	 */
	dynamic: function (a, b)
	{
		var callback = resolveParameters(a, b);
		var namespace = buildDynamic(Initializers.defaultDynamicSetup);
		return invokeCallback(namespace, callback);
	},
	
	/**
	 * @param {string|function=} a
	 * @param {function=} b
	 * @return {*}
	 */
	static: function (a, b)
	{
		var callback = resolveParameters(a, b);
		var namespace = new Namespace();
		
		global.namespace = namespace.getCreator();
		
		return invokeCallback(namespace, callback)
	},

	/**
	 * @param {string|function} path If functio passed, it's treated as the setup function.
	 * @param {function} setup
	 * @param {function=} callback
	 * @return {*}
	 */
	getDependencies: function (path, setup, callback)
	{
		var dep = new DependencyLogger(); 
		var object = new Dependencies(dep);
		
		if (typeof path === 'function')
		{
			setup = path;
			callback = setup;
		}
		else
		{
			Root.set(path);
		}
		
		var namespace = buildDynamic(
			Initializers.defaultDynamicSetup,
			(chain) => { chain.add(dep) },
			setup
		);
			
		callback(object, namespace);
		
		return namespace.root();
	},

	/**
	 * @param {string|function} path If functio passed, it's treated as the setup function.
	 * @param {function} setup
	 * @param {function=} callback
	 * @return {*}
	 */
	setupDynamic: function (path, setup, callback)
	{
		if (typeof path === 'function')
		{
			setup = path;
			callback = setup;
		}
		else
		{
			Root.set(path);
		}
		
		var namespace = buildDynamic(
			Initializers.defaultDynamicSetup,
			setup
		);
		
		return invokeCallback(namespace, callback);
	}
};


INDEX.in = INDEX.in.bind(this);


module.exports = INDEX;