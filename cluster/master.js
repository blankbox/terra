var cluster   = require('cluster');
var tracer    = require('tracer').colorConsole();

var cpuCount = require('os').cpus().length;

if (process.env.LOCATION == 'local') {

  // If running locally, then use a single cluster so as not to litter the CPU with unneed tasks
  cpuCount = 1;

  tracer.log('Running locally, only', cpuCount, 'CPU used in cluster.');

}

tracer.warn('Cluster Master is running with', cpuCount, 'folks.');
tracer.warn('env.LOCATION', process.env.LOCATION);

// Create a worker for each CPU
for (var i = 0; i < cpuCount; i += 1) {
  // Build a object to pass to each folk allowing later access if required
  var new_worker_env = {};
  new_worker_env.WORKER_NAME = 'Worker_' + i;
  // Run the folk
  cluster.fork(new_worker_env);
}
