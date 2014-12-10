Github Status Reporter
======================

Updates build status on Github from a script.

##Usage

```bash
export GITHUB_TOKEN=<github_token>
node index.js --user <repo_user> --repo <repo_name> --branch <branch_name> --state <failure|pending|success>
```

###Example

```bash
export GITHUB_TOKEN=ABCDEFGHIJKLMNOPQRSTUVWXYZ
node index.js --user TakenPilot --repo github-status-reporter --branch master --state success
```


###Example 2

```bash
export GITHUB_TOKEN=ABCDEFGHIJKLMNOPQRSTUVWXYZ
node index.js --user TakenPilot --repo github-status-reporter --branch master --state success /
  --target-url='http://github.com/TakenPilot/github-status-reporter' --description=SUCCESS!
```
