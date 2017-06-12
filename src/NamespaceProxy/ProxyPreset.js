'use strict';


/**
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 */
const PRESET = {
	defineProperty:	() => { throw new Error('Namespace can not be used as an Object'); },
	deleteProperty:	() => { throw new Error('Delete operation can not be applied on a Namespace'); },
	setPrototypeOf:	() => false
};


const ProxyPreset = {

	/**
	 * @return {{}}
	 */
	clone: function () 
	{
		var clone = {};
		
		for (var key in PRESET)
		{
			if (target.hasOwnProperty(key))
			{
				clone[key] = target[key];
			}
		}
		
		return clone;
	},

	/**
	 * @param {{}} target 
	 * @return {{}}
	 */
	merge: function (target)
	{
		var clone = ProxyPreset.clone();
		
		for (var key in target)
		{
			if (target.hasOwnProperty(key))
			{
				clone[key] = target[key];
			}
		}
		
		return clone;
	}
};


module.exports = ProxyPreset;