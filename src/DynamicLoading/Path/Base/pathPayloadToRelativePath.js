'use strict';


const path = require('path');
const Root = require('../../../Setup/Root');


function pathPayloadToRelativePath(dir, payload)
{
	if (typeof payload !== 'string')
		throw Error('Unexpected configuration');
	
	if (Root.directory() === dir || payload[0] === '/')
	{
		return payload;
	}
	else if (payload.substr(0, 2) === '..')
	{
		return dir + '/' + payload; 
	}
	else
	{
		return path.join(dir, payload);
	}
}


module.exports = pathPayloadToRelativePath;