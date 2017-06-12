'use strict';


const randomstring = require("randomstring"); 


module.exports = {
	PATH: 					'__PATH__' + randomstring.generate(32) + '__',
	NAMESPACE_SEPARATOR:	'.'
};