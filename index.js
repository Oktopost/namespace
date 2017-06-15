'use strict';


const path = require('path');

const Namespace		= require('./src/Namespace');
const Dependencies	= require('./src/Build/Dependencies');
const Root			= require('./src/Setup/Root');
const buildDynamic	= require('./src/Setup/buildDynamic');
const Initializers	= require('./src/Setup/Initializers');


/**
 * @param callback
 */
function invokeCallback(callback)
{
	if (typeof callback === 'function')
	{
		callback(namespace());
	}
	else if (typeof callback === 'string')
	{
		require(callback);
	}
	
	return namespace();
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

/**
 * @return {boolean}
 */
function isDefined()
{
	return typeof global.namespace !== 'undefined';
}

/**
 * @return {*}
 */
function callBuildDynamicOnce()
{
	if (!isDefined())
	{
		buildDynamic.apply(null, Array.prototype.slice.call(arguments));
	}
	
	return namespace();
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
		callBuildDynamicOnce(Initializers.defaultDynamicSetup);
		return invokeCallback(callback);
	},

	/**
	 * @param {string} p
	 * @return {*} Namespace root object
	 */
	virtual: function (p)
	{
		if (path.dirname(require.main.filename) !== p)
		{
			p = path.join(p, '../..');
		}
		
		Root.set(p);
		return callBuildDynamicOnce(Initializers.defaultVirtualSetup);
	},
	
	/**
	 * @param {string|function=} a
	 * @param {function=} b
	 * @return {*}
	 */
	static: function (a, b)
	{
		var callback = resolveParameters(a, b);
		
		if (!isDefined())
		{
			global.namespace = (new Namespace()).getCreator();
		}
		
		return invokeCallback(callback)
	},

	/**
	 * @param {string|function} p If function passed, it's treated as the setup function.
	 * @param {function} setup
	 * @param {function=} callback
	 * @return {*}
	 */
	getDependencies: function (p, setup, callback)
	{
		if (typeof global.namespace !== 'undefined')
		{
			throw new Error('Global namespace was already defined!');
		}
		else if (typeof p === 'function')
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
		
		buildDynamic(
			dependencySetup,
			setup
		);
			
		callback(logger, namespace());
		
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
		
		callBuildDynamicOnce(
			Initializers.defaultDynamicSetup,
			setup
		);
		
		return invokeCallback(callback);
	}
};


INDEX.in = INDEX.in.bind(INDEX);


module.exports = INDEX;