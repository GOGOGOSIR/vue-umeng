module.exports = {
  git: {
    requireBranch: 'master',
    commitMessage: 'chore: release v${version}',
    requireCommits: true,
    tagName: 'v${version}',
    tagAnnotation: `release date: ${new Date().toLocaleString()}`,
  },
  github: {
    release: true,
  },
  hooks: {
    'after:version:bump': 'yarn build:all',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
      header: '# CHANGE_LOGS',
      ignoreRecommendedBump: true,
    },
  },
}
