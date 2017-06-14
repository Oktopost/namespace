'use strict';


const path = require('path');
const ROOT_DIR = path.basename(path.dirname(require.main.filename));


function pathPayloadToRelativePath(dir, payload)
{
	if (typeof payload !== 'string')
		throw Error('Unexpected configuration');
	
	if (ROOT_DIR === dir || payload[0] === '/')
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