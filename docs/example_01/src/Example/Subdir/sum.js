namespace('Example.Subdir', function () 
{
	/**
	 * @function Example.Subdir.sum
	 * @alias {sum} 
	 * 
	 * @param {number} a
	 * @param {number} b
	 * @return {number}
	 */
	function sum(a, b)
	{
		return a + b;
	}
	
	
	this.sum = sum;
});