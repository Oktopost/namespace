namespace('Example', function (root) 
{
	const sum = root.Example.Subdir.sum;
	const sub = root.Example.Subdir.sub;
	
	
	/**
	 * @function Example.calc
	 * @alias {calc}
	 * 
	 * @param {number} a
	 * @param {number} b
	 * @return {number}
	 */
	function calc(a, b)
	{
		return sum(a, b) * sub(a, b);
	}
	
	
	this.calc = calc;
});