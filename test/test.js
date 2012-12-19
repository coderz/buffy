var expect = require('expect.js');

var buffy = require('../'),
    buffer = buffy();

describe('#bind/flush', function() {
  var test = false;

  it('should create a function that buffer itself', function() {
    (buffer.bind(function(testarg, testarg1, cbl) {
      expect(testarg).to.be(1);
      expect(testarg1).to.be(2);
      setTimeout(cbl, 500);
    }))(1, 2, function() { test = true; });
  });

  it('should be executed once flush is called', function(done) {
    buffer.flush(function() {
      expect(test).to.be.ok();
      done();
    });
  });
});

describe('#buffer/flush', function() {
  var test = false;

  it('should bufferize a function', function() {
    buffer.buffer(function(testarg, testarg1, cbl) {
      expect(testarg).to.be(1);
      expect(testarg1).to.be(2);
      setTimeout(cbl, 500);
    }, 1, 2, function() { test = true; });
  });

  it('should be executed once flush is called', function(done) {
    buffer.flush(function() {
      expect(test).to.be.ok();
      done();
    });
  });
});

describe('#buffer&#bind/flush', function() {
  var test1 = false,
      test2 = false;

  it('should buffer with #buffer and #bind', function() {
    (buffer.bind(function(cbl) {
      test1 = true;
      setTimeout(cbl, 500);
    }))();

    buffer.buffer(function(cbl) {
      test2 = true;
      setTimeout(cbl, 500);
    });
  });

  it('every buffered function should be executed once flush is called', function(done) {
    buffer.flush(function(cbl) {
      expect(test1).to.be.ok();
      expect(test2).to.be.ok();
      done();
    });
  });
});

