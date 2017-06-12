'use strict';


const Logger = {
	
	/**
	 * @param {Cursor} cursor
	 * @param {string} name
	 * @param {function} callback
	 */
	get: function (cursor, name, callback)
	{
		console.log('Get called in ' + cursor.fullName + ' for ' + name);
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
		console.log('Set called in ' + cursor.fullName + ' for ' + name + ' value => ' + value);
		return callback();
	}
};


module.exports = Logger;