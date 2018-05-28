namespace('Math.Operations', function (root)
{
	const Add = root.Math.Operations.Add;
	
	
	this.Mult = function Mult(a, b)
	{
		var res = 0;
		
		for (var i = 1; i <= b; i++)
		{
			res = Add(res, a);
		}
		
		return res;
	};
});