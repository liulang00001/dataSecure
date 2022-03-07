const GitRevisionPlugin = require('git-revision-webpack-plugin');
const runGitCommand = require('git-revision-webpack-plugin/lib/helpers/run-git-command');

GitRevisionPlugin.prototype.run = function (command) {
  if (!command || typeof command !== 'string') return;
  return runGitCommand(
    this.gitWorkTree,
    command
  )
};

module.exports = GitRevisionPlugin;