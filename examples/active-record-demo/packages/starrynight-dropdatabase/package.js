Package.describe({
  name: 'starrynight:dropdatabase',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Starrynight database management helpers for validation testing.',
  // URL to the Git repository containing the source code for this package.
  git: 'http://github.com/awatson1978/meteor-cookbook/packages/starrynight-dropdatabase',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  isDebug: true
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');

  api.use('meteor-platform@1.0.4');

  api.addFiles('helpers.js', 'server');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('starrynight:dropdatabase');
  api.addFiles('helpers-tests.js');
});
