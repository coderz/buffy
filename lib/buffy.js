var optimal = require('optimal'),
    kilo = require('kilo');

function bufferize(fn, args, wait, scope) {
  var self = this;

  if (!Array.isArray(args))
    args = [].slice.call(args);

  var cbl = typeof args[args.length - 1] === 'function' ?
    args.pop() : null;

  args.push(function() {
    var fns = wait ? self.waitingFns : self.fns,
        idx = fns.indexOf(fn);

    fns.splice(idx, 1);

    cbl && cbl.apply(this, arguments);
  });

  if (wait) 
    this.waitingFns.push(fn.bind(scope || this, args));
  else
    this.fns.push(fn);
  
  !wait && fn.apply(scope || this, args);
}

function bind(fn) {
  var self = this;
  
  return function() {
    self.bufferize(fn, arguments, false, this);
  };
}

function buffer(fn) {
  var opts = optimal(arguments, 'b:[wait], f:fn'),
      args = [].slice.call(arguments, Object.keys(opts).length);

  this.bufferize(opts.fn, args, opts.wait);
}

function flush(cbl) {
  if (this.fns.length)
    return setTimeout(flush.bind(this, cbl), 100); // Yep, this sucks but it's the only way

  kilo.simplerParallel(this.waitingFns, cbl);
}

module.exports = function() {
  return {
    bufferize: bufferize,
    bind: bind,
    buffer: buffer,
    flush: flush,
    waitingFns: [],
    fns: []
  };
};
