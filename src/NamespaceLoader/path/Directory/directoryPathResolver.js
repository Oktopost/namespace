'use strict';


module.exports = function directoryPathResolver(directory, namespace)
{
	var path = namespace.replace(/\./g, '/');
	
	if (directory.length > 0)
	{
		if (directory[directory.length - 1] !== '/')
		{
			directory += '/';
		}
	}
	
	return directory + path;
};