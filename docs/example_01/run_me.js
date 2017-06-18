console.log('Basic oktopost-namespace example');


// 1. index.js exports the Example namespace which is the root namespace of this project
// Note that variables referencing namespace path are written in Pascal case and not camel case.
const Example = require('./index');


// 2. The calc method is inside the Example namespace and it's "full name" is Example.calc
const calc = Example.calc;
// OR
// const calc = require('./index').calc;
// OR
// const calc = namespace().Example.calc;

console.log('Calling function Example.calc(5, 4) = ', calc(5, 4));