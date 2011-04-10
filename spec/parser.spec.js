var Parser = require('../lib/parser').Parser;

describe('Parser', function(){
    var parser;

    beforeEach(function() { parser = new Parser() })

    it('VT should have actions defined', function(){
        Parser.actions.should.be.instanceof.Object;
    });

    describe('initialization', function(){
        it('should have state GROUND', function(){
            parser.state.should.eql('GROUND');
        });
        ['numIntermediateChars', 'numParams', 'ignoreFlagged'].forEach(function(property) {
            it('should have ' + property + ' set to 0', function(){
                parser[property].should.eql(0);
            });
        });
    });

    describe('actions', function() {
        ['ignore', 'print', 'execute', 'clear', 'collect', 'param', 'csi_dispatch', 'esc_dispatch',
            'hook', 'put', 'unhook', 'osc_start', 'osc_put', 'osc_end'].forEach(function(action) {
                it('should have ' + action + 'defined as function', function(){ 
                    Parser.actions[action].should.be.a('function');
                });
        });
    });


    describe('changeState(newState)', function() {
        var called;
        beforeEach(function() {
            called = false;
            Parser.actions.xentry = function() { called = true }
            Parser.actions.xexit = function() { called = true }
            Parser.transitions.HELLO = {
                exit: 'xentry',
                entry: 'xexit',
            };
            parser.state = 'HELLO';
        });

        it('should call exit action from old state', function() {
            called.should.be.false;
            parser.changeState('GROUND');
            called.should.be.true;
        });

        it('should change state to newState', function() {
            parser.changeState('GROUND');
            parser.state.should.eql('GROUND');
        });

        it('should call entry action to newState', function() {
            called.should.be.false;
            parser.changeState('HELLO');
            called.should.be.true;
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
            times.should.eql(5);
        });
    });

    describe('pushChar(char)', function() {
        beforeEach(function() {
            parser = new Parser();
        })
        it('should !!!', function() {
            parser.pushChars("\033[0;31mhello");
            // parser.pushChars("\033[1;31mhello\t\t\033[0m");
        });
    });

});
