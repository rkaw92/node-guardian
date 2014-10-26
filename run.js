var SingleInstanceRunner = require('./SingleInstanceRunner').SingleInstanceRunner;
var daemon = require('daemon');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
	boolean: true,
	'--': true
});
var daemonize = argv.background || false;

if(daemonize){
	daemon();
}

var nodeFileName = argv._[0];

var runner = new SingleInstanceRunner({
  command: 'node',
  args: [ nodeFileName ],
  options: {
    cwd: __dirname,
    stdio: 'inherit',
	env: process.env
  }
});

runner.start();
