var child_process = require('child_process');
var when = require('when');
var EventEmitter = require('events').EventEmitter;

function ChildProcess(processHandle){
  var self = this;
  EventEmitter.call(this);

  var exiting = false;
  var exitPromise = when.promise(function waitForExit(fulfill, reject){
    processHandle.on('exit', function(){
      fulfill({ reason: 'exit' });
    });
    processHandle.on('error', function(){
      fulfill({ reason: 'error' });
    });
  });
  exitPromise.done(function(exitInformation){
    if(exitInformation.reason === 'error'){
      self.emit('error', exitInformation);
    }
    else{
      self.emit('exit', exitInformation);
    }
  });

  this.kill = function kill(signal){
    if(exiting){
      processHandle.kill(signal);
      exiting = true;
    }
    return exitPromise;
  };

  Object.defineProperty(this, 'exitPromise', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: exitPromise
  });
}
ChildProcess.prototype = Object.create(EventEmitter.prototype);

//TODO: Use a decorator pattern; provide pluggable "facilities".
// One such facility could be a socket (TCP?) forwarding mechanism via
//  which children can be routed to (dynamic mappings).

ChildProcess.spawn = function spawn(command, args, options){
  var processHandle = child_process.spawn(command, args, options);
  return new ChildProcess(processHandle);
};

module.exports.ChildProcess = ChildProcess;
