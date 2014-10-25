var SingleInstanceRunner = require('./SingleInstanceRunner').SingleInstanceRunner;
var daemon = require('daemon');

daemon();

var runner = new SingleInstanceRunner({
  command: 'node',
  args: ['./BuggyDaemon.js'],
  options: {
    cwd: __dirname,
    stdio: 'inherit'
  }
});

runner.start();
