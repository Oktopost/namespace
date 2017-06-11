"use strict";


const fs = require( 'fs' );


function readDir(dir)
{
	var res = fs.readdirSync(dir);
	
	res.forEach(function (file)
	{
		var fullName = dir + '/' + file;
		var stat = fs.statSync(fullName);
		
		if (stat.isFile())
		{
			require(fullName);
		}
		else
		{
			readDir(fullName);
		}
	});
}