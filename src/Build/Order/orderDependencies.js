'use strict';


const OrderedContainer = require('./OrderedContainer');


/**
 * @param {OrderedContainer} container
 * @param {*} dependencies
 * @return {boolean}
 * @private
 */
function _cleanEmpty(container, dependencies)
{
	var value;
	var modified = false;
	
	for (var key in dependencies)
	{
		if (!dependencies.hasOwnProperty(key))
			continue;
		
		value = dependencies[key];
		
		if (value.length === 0)
		{
			container.add(key);
			delete dependencies[key]; 
			modified = true;
		}
	}
	
	return modified;
}

/**
 * @param {OrderedContainer} container
 * @param {Array.<string>} element
 * @param {{}} dependencies
 * @return {Array.<string>}
 * @private
 */
function _cleanLoadedDependenciesForElement(container, element, dependencies)
{
	var value;
	var newDependencies	= [];
	
	for (var i = 0; i < element.length; i++)
	{
		value = element[i];
		
		if (typeof dependencies[value] === 'undefined')
		{
			container.add(value);
		}
		else if (!container.has(value))
		{
			newDependencies.push(value);
		}
	}
	
	return newDependencies;
}

/**
 * @param {OrderedContainer} container
 * @param {*} dependencies
 * @return {boolean}
 * @private
 */
function _cleanLoadedDependencies(container, dependencies)
{
	var initialCount;
	var modified= false;
	
	for (var key in dependencies)
	{
		if (!dependencies.hasOwnProperty(key))
			continue;
		
		initialCount = dependencies[key].length;
		dependencies[key] = _cleanLoadedDependenciesForElement(container, dependencies[key], dependencies);
		
		if (dependencies[key].length !== initialCount)
		{
			modified = true;
		}
	}
	
	return modified;
}

function _clone(dependencies)
{
	var newDependencies = {};
	
	for (var key in dependencies)
	{
		if (!dependencies.hasOwnProperty(key))
			continue;
		
		newDependencies[key] = dependencies[key].concat();
	}
	
	return newDependencies; 
}


function orderDependencies(dependencies)
{
	var container = new OrderedContainer();
	var modified = true;
	var i = 0;
	
	dependencies = _clone(dependencies);
	
	while (modified)
	{
		modified = _cleanEmpty(container, dependencies);
		container.apply();
		
		modified = _cleanLoadedDependencies(container, dependencies) || modified;
		container.apply();
	}
	
	if (Object.keys(dependencies).length !== 0)
	{
		throw new UnresolvedDependencyException(JSON.stringify(dependencies, null, 4)); 
	}
	
	return container.getOrdered();
}


module.exports = orderDependencies;