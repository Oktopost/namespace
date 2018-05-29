const NamespaceException = require('./Exceptions/NamespaceException');


/**
 * @param {RootNamespace} root
 * @constructor
 */
function Dependencies(root)
{
	this._root = root;
}


/**
 * @param {NamespaceMember} member
 * @param {{}} dependants
 * @param {{}} dependencies
 * @param {{}=} processed
 * @private
 */
Dependencies.prototype._flatten = function (member, dependants, dependencies, processed)
{
	processed = processed || {};
	
	var file = member.definition().file().fullPath();
	var deps = member.definition().getDependencies();
	
	dependencies[file] = dependencies[file] || {};
	
	for (var i = 0; i < deps.length; i++)
	{
		var dep = deps[i];
		var path = dep.definition().file().fullPath();
		
		dependants[path] = dependants[path] || {};
		dependants[path][file] = true;
		
		dependencies[file][path] = true;
		
		if (!processed[dep.fullName()])
		{
			processed[dep.fullName()] = true;
			this._flatten(dep, dependants, dependencies, processed);
		}
	}
};

/**
 * @param {*} dependencies
 * @return {[string]}
 * @private
 */
Dependencies.prototype._getFreeFiles = function (dependencies)
{
	var list = [];
	var keys = Object.keys(dependencies);
	
	for (var i = 0; i < keys.length; i++)
	{
		var key = keys[i];
		var map = dependencies[key];
		
		if (Object.keys(map).length === 0)
		{
			list.push(key);
			delete dependencies[key];
		}
	}
	
	return list;
};

/**
 * @param {NamespaceMember} member
 * @param {boolean} includeTargetFile
 * @return {[string]}
 * @private
 */
Dependencies.prototype._getMemberFileDependencies = function (member, includeTargetFile)
{
	var dependants = {};
	var dependencies = {};
	var result;
	var toCheck;
	var i; 
	
	this._flatten(member, dependants, dependencies);
	
	toCheck = this._getFreeFiles(dependencies);
	result = toCheck.sort().concat();
	
	while (toCheck.length > 0)
	{
		for (i = 0; i < toCheck.length; i++)
		{
			var item = toCheck[i];
			var deps = dependants[item];
			
			delete dependants[item];
			
			for (var dep in deps)
			{
				if (!dependencies[dep]) continue;
				
				delete dependencies[dep][item];
			}
		}
		
		toCheck = this._getFreeFiles(dependencies);
		result = result.concat(toCheck.sort());
	}
	
	return result;
};


/**
 * 
 * @param {string} targetElement
 * @param {boolean=true} includeTargetFile
 */
Dependencies.prototype.files = function (targetElement, includeTargetFile)
{
	includeTargetFile = (includeTargetFile !== false);
	
	var member = this._root.getMember(targetElement);
	
	if (member === null)
		throw new NamespaceException('The target element <' + targetElement + '> was not found');
	 
	return this._getMemberFileDependencies(member, includeTargetFile);
};


module.exports = Dependencies;