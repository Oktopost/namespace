namespace('Example.Subdir', function () 
{
	/**
	 * @function Example.Subdir.sub
	 * @alias {sub} 
	 * 
	 * @param {number} a
	 * @param {number} b
	 * @return {number}
	 */
	function sub(a, b)
	{
		return a - b;
	}
	
	
	this.sub = sub;
});