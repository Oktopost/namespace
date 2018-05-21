const NamespaceException = require('./../Exceptions/NamespaceException');


function AbstractResolver()
{
	
}


/**
 * @return {[string]|string}
 */
AbstractResolver.prototype.getConfigPrefix = function ()
{
	throw new NamespaceException('Method not implemented');
};

/**
 * @param {string} folder
 * @param {{}} config
 */
AbstractResolver.prototype.parseConfig = function (folder, config)
{
	throw new NamespaceException('Method not implemented');
};

/**
 * @param {string} fullName
 * @return {boolean}
 */
AbstractResolver.prototype.isValidPath = function (fullName)
{
	throw new NamespaceException('Method not implemented');
};

/**
 * @param {string} fullName
 * @return {boolean}
 */
AbstractResolver.prototype.isValidFile = function (fullName)
{
	throw new NamespaceException('Method not implemented');
};

/**
 * @param {string} fullName
 * @return {string}
 */
AbstractResolver.prototype.getFilePath = function (fullName)
{
	throw new NamespaceException('Method not implemented');
};


module.exports = AbstractResolver;