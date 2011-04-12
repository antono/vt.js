var Term = require('../lib/faketerm').Term;

describe('Term', function(){
    var term;

    beforeEach(function() {
        term = new Term();
    })

    it('fake term should be a object', function(){
        term.should.be.instanceof.Object;
    });

    describe('should implement print(chr)', function(){
        it('should just push char to canvas', function(){
            term.canvas.should.eql("");
            term.print('A');
            term.canvas.should.eql("A");
        });
    });
});
