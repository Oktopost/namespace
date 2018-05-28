namespace('Math.Operations', function (root)
{
	const Add = root.Math.Operations.Add;
	
	
	this.Sub = function Sub(a, b)
	{
		return Add(a, -b);
	};
});