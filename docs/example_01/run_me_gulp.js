console.log('Basic oktopost-namespace example for gulp');


let result = require('oktopost-namespace').getDependencies(
	__dirname, 
	() => {}, 
	(root) =>
	{
		const calc = root.Example.calc;
	});


console.log();
console.log('Library dependencies are:');
console.log('-------------------------');
console.log(result);
console.log();