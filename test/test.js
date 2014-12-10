var StatusReporter = require('../lib'),
  sinon = require('sinon'),
  expect = require('chai').expect;

describe('good data', function () {
  var sandbox,
    statusReporter,
    statuses,
    repos,
    fakeSha = '4eb9e0fd807f95473dc7207c556014215c40ec3b',
    github = {
      statuses: {
        create: function() {}
      },
      repos: {
        getBranch: function() {}
      }
    };

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    statuses = sandbox.mock(github.statuses);
    repos = sandbox.mock(github.repos);
    statusReporter = new StatusReporter(null, github);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('sha', function (done) {
    var data = {};
    statuses.expects('create').once().withArgs({
      repo: "repo",
      sha: fakeSha,
      state: "state",
      user: "user"
    }).yields(null, data);

    statusReporter.update({
      user: 'user',
      repo: 'repo',
      sha: fakeSha,
      state: 'state'
    }, function (err, result) {
      expect(result).to.equal(data);
      done();
    });

    sandbox.verify();
  });

  it('branch', function (done) {
    var data = {};
    statuses.expects('create').once().withArgs({
      repo: "repo",
      sha: fakeSha,
      state: "state",
      user: "user"
    }).yields(null, data);
    repos.expects('getBranch').once().yields(null, {commit: {sha: fakeSha}});

    statusReporter.update({
      user: 'user',
      repo: 'repo',
      branch: 'branch',
      state: 'state'
    }, function (err, result) {
      expect(result).to.equal(data);
      done();
    });

    sandbox.verify();
  });

  it('branch with description', function (done) {
    var data = {};
    statuses.expects('create').once().withArgs({
      description: "description",
      repo: "repo",
      sha: fakeSha,
      state: "state",
      user: "user"
    }).yields(null, data);
    repos.expects('getBranch').once().yields(null, {commit: {sha: fakeSha}});

    statusReporter.update({
      user: 'user',
      repo: 'repo',
      branch: 'branch',
      state: 'state',
      description: 'description'
    }, function (err, result) {
      expect(result).to.equal(data);
      done();
    });

    sandbox.verify();
  });

  it('branch with target url', function (done) {
    var data = {};
    statuses.expects('create').once().withArgs({
        'target_url': 'target-url',
        repo: "repo",
        sha: fakeSha,
        state: "state",
        user: "user"
      }).yields(null, data);
    repos.expects('getBranch').once().yields(null, {commit: {sha: fakeSha}});

    statusReporter.update({
      user: 'user',
      repo: 'repo',
      branch: 'branch',
      state: 'state',
      'target-url': 'target-url'
    }, function (err, result) {
      expect(result).to.equal(data);
      done();
    });

    sandbox.verify();
  });
});