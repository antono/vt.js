var Parser = require('../lib/parser').Parser;

describe('Parser', function(){
    var parser;
    beforeEach(function() { parser = new Parser() })

    it('VT should have actions defined', function(){
        Parser.actions.should.be.instanceof.Object;
    });

    describe('initialization', function(){
        it('Should set default values', function(){
        })
    });

});
