'use strict';


const assert = require('chai').assert;



suite('index.js', () => {
	test('Namespace set correctly', () => {
		var namespace = require('../../index');
		
		assert.isFunction(namespace);
		assert.equal(require('../../src/Namespace'), namespace);
	});
});