var ChildProcess = require('./ChildProcess').ChildProcess;
var when = require('when');

function InstanceSpecification(command, args, options){
  this.command = command;
  this.args = args;
  this.options = options;
}

function SingleInstanceRunner(instanceSpecification){
  var self = this;

  this._run = function _run(){
    // First, reset the instance in case we exit early.
    self._instance = null;
    if(!self._shouldRestart){
      exit;
    }
    // Then, create and spawn a new one.
    self._instance = ChildProcess.spawn(
      instanceSpecification.command,
      instanceSpecification.args,
      instanceSpecification.options
    );

    // Extract its exit promise for our own use.
    self._exitPromise = self._instance.exitPromise;

    // In case it exits, try re-running a new instance.
    self._exitPromise.done(function(){
      _run();
    });
  };

  this._shouldRestart = false;
  this._instance = null;
  this._exitPromise = null;
}

SingleInstanceRunner.prototype.start = function start(){
  this._shouldRestart = true;
  // If an instance is not already running, start a new one.
  if(!this._instance){
    this._run();
  }
};

SingleInstanceRunner.prototype.stop = function stop(killSignal){
  this._shouldRestart = false;
  if(killSignal > 0 && this._instance){
    return this._instance.kill(killSignal);
  }
  return this._exitPromise || when.resolve();
};

module.exports.SingleInstanceRunner = SingleInstanceRunner;
