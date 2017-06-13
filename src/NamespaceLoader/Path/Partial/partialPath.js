'use strict';


module.exports = function partialPath(prefix, path, namespace)
{
	if (path.length > 0)
	{
		if (path[path.length - 1] !== '/')
		{
			path += '/';
		}
	}
	
	if (prefix.length > 0)
	{
		if (namespace.substr(0, prefix.length) !== prefix || 
			namespace.length <= prefix.length)
		{
			throw new Error('The namespace ' + namespace + ' does not start with the prefix ' + prefix);
		}
		
		namespace = namespace.substr(prefix.length);
		
		if (namespace[0] === '.')
		{
			namespace = namespace.substr(1);
		}
	}
	
	return path + namespace.replace(/\./g, '/');
};