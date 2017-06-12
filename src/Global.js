'use strict';


const Namespace = require('./Namespace');


var globalNamespace = new Namespace();
global.namespace = globalNamespace.getCreator();