const fs = require('fs');
const Crawler = require('./Crawler');


/**
 * @param onDependency
 * 
 * @constructor
 */
function SyncFS(onDependency)
{
	Crawler.call(this, onDependency);
}


SyncFS.prototype = Object.create(Crawler.prototype);
SyncFS.prototype.constructor = SyncFS;


SyncFS.prototype._readPath = function (path, file)
{
	var fullName = path + '/' + file;
	var stat = fs.statSync(fullName);
	
	if (stat.isFile())
	{
		if (typeof this._onDependency !== 'undefined')
		{
			this._onDependency(fullName);
		}
	}
	else
	{
		this._readDir(fullName);
	}
};

/**
 * @param {string} path
 * @private
 */
SyncFS.prototype._readDir = function (path)
{
	var res = fs.readdirSync(path);
	res.forEach(this._readPath.bind(this, path));
};



/**
 * @param {string} path
 */
SyncFS.prototype._doScan = function (path)
{
	this._readDir(path);
	return true;
};


module.exports = SyncFS;