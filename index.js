'use strict';


const path = require('path');

const Namespace		= require('./src/Namespace');
const Dependencies	= require('./src/Build/Dependencies');
const Root			= require('./src/Setup/Root');
const buildDynamic	= require('./src/Setup/buildDynamic');
const Initializers	= require('./src/Setup/Initializers');


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
	 * @param {string} p
	 */
	virtual: function (p)
	{
		Root.set(path.join(p, '../..'));
		return buildDynamic(Initializers.defaultVirtualSetup).root();
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
	 * @param {string|function} p If function passed, it's treated as the setup function.
	 * @param {function} setup
	 * @param {function=} callback
	 * @return {*}
	 */
	getDependencies: function (p, setup, callback)
	{
		if (typeof p === 'function')
		{
			setup = p;
			callback = setup;
		}
		else
		{
			Root.set(p);
		}
		
		var dependencySetup = Initializers.createDependencyLoggerSetup();
		var logger = dependencySetup.dependenciesLogger;
		
		var namespace = buildDynamic(
			dependencySetup,
			setup
		);
			
		callback(logger, namespace);
		
		return (new Dependencies(logger)).getResolved();
	},

	/**
	 * @param {string|function} p If functio passed, it's treated as the setup function.
	 * @param {function} setup
	 * @param {function=} callback
	 * @return {*}
	 */
	setupDynamic: function (p, setup, callback)
	{
		if (typeof p === 'function')
		{
			setup = p;
			callback = setup;
		}
		else
		{
			Root.set(p);
		}
		
		var namespace = buildDynamic(
			Initializers.defaultDynamicSetup,
			setup
		);
		
		return invokeCallback(namespace, callback);
	}
};


INDEX.in = INDEX.in.bind(INDEX);


module.exports = INDEX;