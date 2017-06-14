'use strict';


const buildDynamic = require('./src/Setup/buildDynamic');
const Initializers = require('./src/Setup/Initializers');


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