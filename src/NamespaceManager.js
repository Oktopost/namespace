const Manager	= require('./Definition/Manager');

const configSearch	= require('./Configuration/configSearch');

const DirResolver			= require('./Resolvers/DirResolver');
const ResolveCollection		= require('./Resolvers/ResolveCollection');
const SingleFileResolver	= require('./Resolvers/SingleFileResolver');
const PartialPathResolver	= require('./Resolvers/PartialPathResolver');

const NamespaceException = require('./Exceptions/NamespaceException');


function NamespaceManager()
{
	this._resolvers = [
		new DirResolver(),
		new SingleFileResolver(),
		new PartialPathResolver()
	];
	
	this._defManager = new Manager();
}


NamespaceManager.prototype._readConfig = function (file, config)
{
	if (typeof config.map === 'undefined')
		return;
	
	var path = require('path');
	
	var found;
	var directory = path.dirname(file);
	
	config = config.map;
	
	for (var key in config)
	{
		found = false;
		
		for (var i = 0; i < this._resolvers.length; i++)
		{
			var resolver = this._resolvers[i];
			
			if (resolver.getConfigPrefix().indexOf(key) === -1)
				continue;
			
			found = true;
			
			resolver.parseConfig(
				directory,
				config[key]
			);
			
			break;
		}
		
		if (found === false)
			throw new NamespaceException(`Unrecognized key ${key} encountered, when parsing ${file}`);
	}
};

NamespaceManager.prototype._onReadConfigError = function (path, error)
{
	throw new NamespaceException(`Error encountered while parsing ${path}: ${error.toString()}`);
};


/**
 * @param {AbstractResolver[]} resolvers
 * @return {NamespaceManager}
 */
NamespaceManager.prototype.addResolvers = function (resolvers)
{
	this._resolvers.push(...resolvers);
	return this;
};

/**
 * @param {string} rootDir
 * @return {NamespaceManager}
 */
NamespaceManager.prototype.setup = function (rootDir)
{
	this._defManager.config().fileResolver = new ResolveCollection(this._resolvers);
	
	configSearch(
		rootDir, 
		this._readConfig.bind(this),
		this._onReadConfigError.bind(this)
	);
	
	return this;
};

/**
 * @param {function|string} item
 * @returns {NamespaceManager}
 */
NamespaceManager.prototype.load = function (item)
{
	this._defManager.parse(item);
	return this;
};

/**
 * @return {*}
 */
NamespaceManager.prototype.getRoot = function ()
{
	return this._defManager.root();
};

/**
 * @param {string} rootDir
 * @param {function=} item
 * @param {[AbstractResolver]=} resolvers
 * @return {NamespaceManager}
 */
NamespaceManager.setup = function (rootDir, item, resolvers)
{
	var ns = new NamespaceManager()
		.addResolvers(resolvers || [])
		.setup(rootDir);
	
	if (item)
		ns.load(item);
	
	return ns;
};


module.exports = NamespaceManager;