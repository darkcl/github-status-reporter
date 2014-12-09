var argv = require('minimist')(process.argv.slice(2));

argv.token = argv.token || process.env.GITHUB_TOKEN
argv.sha = argv.sha || process.env.GITHUB_SHA
argv.user = argv.user || process.env.GITHUB_USER
argv.repo = argv.repo || process.env.GITHUB_REPO
argv.state = argv.state || process.env.GITHUB_STATE
argv['target-url'] = argv['target-url'] || process.env.GITHUB_TARGET_URL
argv.description = argv.description || process.env.GITHUB_DESCRIPTION

var query;
var GitHubApi = require('github');
var github = new GitHubApi({
  version: "3.0.0",
  protocol: "https",
  timeout: 5000,
  headers: { "user-agent": "mocha-github-reporter" }
});

if (argv.token) {
  q = {
    type: "token",
      token: process.env.GITHUB_TOKEN
  }
  github.authenticate(q, function (err, res) {
    if (err) throw err;
  })
} else {
  throw new "Missing Token"
}

if (argv.branch || argv.sha && argv.sha.length !== 40 ) {
  withBranch(argv.branch || argv.sha, function(err, branch) {
    argv.sha = branch.commit.sha;
    postUpdates();
  });
} else {
  postUpdates();
}

function withBranchPullRequest(branchName, fn) {
  github.pullRequests.getAll({
    user: argv.user,
    repo: argv.repo
  }, function (err, res) {
    if (res) {
      var index = -1;

      for(var i = 0; i < res.length; i++) {
        if (res[i].head.ref === branchName) {
          index = i;
        }
      }

      if (index !== -1) {
        fn(err, res[index]);
      } else {
        console.log(branchName, ' branch not found');
      }
    } else {
      fn(err);
    }
  })
}

function withBranch(branchName, fn) {
  github.repos.getBranch({
    user: argv.user,
    repo: argv.repo,
    branch: argv.branch || argv.sha
  }, function (err, res) {
    if (err) {
      throw err;
    } else {
      fn(err, res);
    }
  })
};

function postUpdates() {
  if (argv.user && argv.repo && argv.sha && argv.state) {
    q = {
      user: argv.user,
      repo: argv.repo,
      sha: argv.sha,
      state: argv.state
    }
    if (argv['target-url']) {
      q['target_url'] = argv['target-url'];
    }
    if (argv.description) {
      q.description = argv.description;
    }
    github.statuses.create(q, function (err, res) {
      if (err) throw err;
    })
  }

  if (argv.user && argv.repo && argv.sha && argv.body && argv.commit_id) {
    github.repos.createCommitComment({
      user: argv.user,
      repo: argv.repo,
      sha: argv.sha,
      body: argv.body,
      commit_id: argv.commit_id
    }, function (err, res) {
      if (err) throw err;
    })
  }
}



