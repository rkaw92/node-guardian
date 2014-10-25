function BuggyDaemon(crashProbability, operationInterval){
  console.log('Welcome to the land of software bugs!');
  setInterval(function(){
    console.log('Operation in progress...');
    if(Math.random() < crashProbability){
      console.error('Oops! The buggy daemon crashed again!');
      process.exit(42);
    }
  }, operationInterval);
}

BuggyDaemon(0.1, 1000);
