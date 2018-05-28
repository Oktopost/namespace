namespace('Math', function (root)
{
	const Add		= root.Math.Operations.Add;
	const Sub		= root.Math.Operations.Sub;
	const Mult		= root.Math.Operations.Mult;
	
	const Consts	= root.Config.Consts;
	
	
	function Operation(num)
	{
		this._num = num;
		this.exec = this.exec.bind(this);
	}
	
	Operation.prototype.exec = function ()
	{
		var num = Add(this._num, Consts.addition);
		num = Mult(num, Consts.mult);
		return Sub(num, Consts.sub);
	};
	
	
	this.Operation = Operation;
});