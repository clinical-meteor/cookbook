Package.describe({
  name: 'starrynight:glass-ui',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Inspired by the Day Made of Glass videos....',
  // URL to the Git repository containing the source code for this package.
  git: 'http://github.com/awatson1978/meteor-cookbook/packages/glass-ui',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use("less");
  api.addFiles('glass-ui.less');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('starrynight:glass-ui');
  api.addFiles('glass-ui-tests.js');
});
