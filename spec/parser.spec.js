var Parser = require('../lib/parser').Parser;

describe('Parser', function(){
    var parser;

    beforeEach(function() { parser = new Parser() })

    describe('initialization', function(){
        it('should be in state GROUND', function(){
            parser.state.should.eql('GROUND');
        });
        ['numIntermediateChars', 'numParams', 'ignoreFlagged'].forEach(function(property) {
            it('should have ' + property + ' set to 0', function(){
                parser[property].should.eql(0);
            });
        });
    });

    describe('changeState(newState)', function() {

        var entryCalled, exitCalled;

        beforeEach(function() {

            entryCalled = false;
            exitCalled  = false;

            // Fake transition for testing
            Parser.transitions.HELLO = { exit: 'unhook', entry: 'hook' };

            parser = new Parser(function(parser, action, chr) {
                if (action === 'unhook') exitCalled = true;
                if (action === 'hook')   entryCalled = true;
            });

            parser.state = 'HELLO';
        });

        it('should call exit action from old state', function() {
            exitCalled.should.be.false;
            parser.state.should.eql('HELLO');
            parser.changeState('GROUND');
            exitCalled.should.be.true;
        });

        it('should change state to newState', function() {
            parser.changeState('GROUND');
            parser.state.should.eql('GROUND');
        });

        it('should call entry action to newState', function() {
            entryCalled.should.be.false;
            parser.changeState('HELLO');
            entryCalled.should.be.true;
        });
    });

    describe('pushChars(string)', function() {
        it('it should call pushChar(chr) for each char in string', function() {
            var times = 0;
            var chars = "abcde";
            parser.pushChar = function(chr) {
                chr.should.eql(chars[times]);
                times += 1;
            }
            times.should.eql(0);
            parser.pushChars(chars);
            times.should.eql(chars.length);
        });
    });

});
