'use strict';


const Logger = {
	
	/**
	 * @param {Cursor} cursor
	 * @param {string} name
	 * @param {function} callback
	 */
	get: function (cursor, name, callback)
	{
		if (cursor.fullName === '')
		{
			console.log('[NS GET] : global <' + name + '>');
		}
		else
		{
			console.log('[NS GET] : global.' + cursor.fullName + ' <' + name + '>');
		}
		
		return callback();
	},
	
	/**
	 * @param {Cursor} cursor
	 * @param {string} name
	 * @param {*} value
	 * @param {function} callback
	 */
	set: function (cursor, name, value, callback)
	{
		console.log('[NS SET] : global.' + cursor.fullName + ' <' + name + '>' + ' = ' + value);
		return callback();
	}
};


module.exports = Logger;