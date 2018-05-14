const DefinitionResult = require('./DefinitionResult');


/**
 * @property {DefinitionResult[]} _definitions
 * @constructor
 */
function DefinitionsCollection()
{
	this._definitions = [];
}


/**
 * @param {string=} name
 * @return {DefinitionResult}
 */
DefinitionsCollection.prototype.add = function (name)
{
	var def = new DefinitionResult(name);
	
	this._definitions.push(def);
	
	return def;
};

DefinitionsCollection.prototype.isEmpty = function()
{
	return this._definitions.length === 0;
};

DefinitionsCollection.prototype.count = function()
{
	return this._definitions.length;
};

/**
 * @return {DefinitionResult|null}
 */
DefinitionsCollection.prototype.first = function()
{
	return this._definitions[0] || null;
};

/**
 * @return {DefinitionResult[]}
 */
DefinitionsCollection.prototype.all = function()
{
	return this._definitions;
};


module.exports = DefinitionsCollection;