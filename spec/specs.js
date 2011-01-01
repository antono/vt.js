var jasmine = require('../deps/jasmine/lib/jasmine');
var sys = require('sys');
var should = require('../deps/should');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

var isVerbose = false;
var showColors = true;

jasmine.executeSpecsInFolder(__dirname, function(runner, log){
  process.exit(runner.results().failedCount);
}, isVerbose, true);
