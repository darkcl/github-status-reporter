/**
 * @param token
 * @param [github] Github Interface
 * @constructor
 */
var StatusReporter = function (token, github) {
  'use strict';
  if (github) {
    this.github = github;
  } else {
    var GitHubApi = require('github');
    this.github = new GitHubApi({
      version: "3.0.0",
      protocol: "https",
      timeout: 5000,
      headers: { "user-agent": "github-status-reporter" }
    });

    if (token) {
      var q = {
        type: "token",
        token: token
      };
      this.github.authenticate(q, function (err) {
        if (err) {
          throw err;
        }
      });
    } else {
      throw new Error("Missing Github Token");
    }
  }
};

StatusReporter.prototype = {
  update: function (argv, cb) {
    'use strict';
    var github = this.github;
    //if the sha is not length 40, assume they meant branch
    if (argv.sha && argv.sha.length !== 40) {
      argv.branch = argv.sha;
    }
    if (argv.branch) {
      withBranch(github, argv, function(err, branch) {
        if (err) {
          cb(err);
        } else {
          //the latest commit in the branch becomes the sha for the update
          argv.sha = branch.commit.sha;
          postUpdates(github, argv, cb);
        }
      });
    } else {
      postUpdates(github, argv, cb);
    }
  }
};

module.exports = StatusReporter;

//function withBranchPullRequest(github, argv, fn) {
//  github.pullRequests.getAll({
//    user: argv.user,
//    repo: argv.repo
//  }, function (err, res) {
//    if (err) {
//      fn(err);
//    } else {
//      var index = -1;
//
//      for (var i = 0; i < res.length; i++) {
//        if (res[i].head.ref === argv.branch) {
//          index = i;
//        }
//      }
//
//      if (index !== -1) {
//        fn(err, res[index]);
//      } else {
//        fn(new Error(argv.branch + ' not found'));
//      }
//    }
//  })
//}

function withBranch(github, argv, fn) {
  github.repos.getBranch({
    user: argv.user,
    repo: argv.repo,
    branch: argv.branch
  }, fn);
}

function postUpdates(github, argv, cb) {
  if (argv.user && argv.repo && argv.sha && argv.state) {
    var q = {
      user: argv.user,
      repo: argv.repo,
      sha: argv.sha,
      state: argv.state
    };
    if (argv['target-url']) {
      q.target_url = argv['target-url'];
    }
    if (argv.description) {
      q.description = argv.description;
    }
    if (argv.context) {
      q.context = argv.context;
    }
    github.statuses.create(q, cb);
  }
}
