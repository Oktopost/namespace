namespace('', function (root)
{
	const Consts = root.Config.Consts;
	const Operation = root.Math.Operation;
	
	
	this.Full = {
		exec: function ()
		{
			console.log(Operation);
			
			var num = Consts.main;
			var op = new Operation(num);
			return op.exec();
		}
	};
});