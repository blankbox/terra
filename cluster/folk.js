// Util modules
var fs       = require('fs-extra');
var debug   = require('tracer').colorConsole();

// Web server (express middleware) modules
var express  = require('express');
var helmet   = require('helmet');
var cors     = require('cors');
var logger   = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

// Fetch application dependancies
var cache = require('../lib/cacheFiles.js');
var buildConfig = require('../lib/buildConfig.js');

// Location variables
var project = __dirname + '/../project';
var collectionDir = project + '/collections';

var config = buildConfig(project);

var app = express();

// Consume middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(logger('dev'));

// @TODO add favicon setting globally to the app
//app.use(favicon(__dirname + '/favicon.ico'));

// In dev mode - output the entire configuration to a server
// @TODO put dev mode etc into envs

app.get('/config', function (req, res) {
  res.json(config);
});

// @TODO add secure end point
app.listen(process.env.TERRA_PORT, function () {
  debug.info('Example app listening on port', process.env.TERRA_PORT);
});
