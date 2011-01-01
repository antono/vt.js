var VT = require('../src/vt').VT;

describe('VT.Parser', function(){
    var parser;
    beforeEach(function() { parser = new VT.Parser() })

    it('VT should have Parser', function(){
        VT.Parser.should.be.instanceof.Object;
    });

    describe('initialization', function(){
        it('Should set default values', function(){
            parser.state.should.eql(0);
            parser.numIntermediateChars.should.eql(0);
            parser.numParams.should.eql(0);
            parser.ignoreFlagged.should.eql(0);
        })
    });

});
