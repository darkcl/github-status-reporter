var argv = require('minimist')(process.argv.slice(2));

argv.token = argv.token || process.env.GITHUB_TOKEN;
argv.sha = argv.sha || process.env.GITHUB_SHA;
argv.user = argv.user || process.env.GITHUB_USER;
argv.repo = argv.repo || process.env.GITHUB_REPO;
argv.state = argv.state || process.env.GITHUB_STATE;
argv['target-url'] = argv['target-url'] || process.env.GITHUB_TARGET_URL;
argv.description = argv.description || process.env.GITHUB_DESCRIPTION;

var query;
var StatusReporter = require('./lib');
var statusReporter = new StatusReporter(argv.token);
statusReporter.update(argv, function (err, res) {
  if (err) console.error(err);
  else if (res && argv.debug) console.log(res);
});




